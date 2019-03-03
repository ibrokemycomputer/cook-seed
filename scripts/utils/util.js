// REQUIRE
// ----------------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const fs = require('fs');

// JSDOM
const jsdomLib = require('jsdom');
const { JSDOM } = jsdomLib;

// Config
const {includeAttr,inlineAttr} = require(`${cwd}/config/main.js`);


// JSDOM CONFIG
// ----------------------------------
// https://github.com/jsdom/jsdom
const jsdom = {
  baseUrl: 'https://localhost',
  dom: newJSDOM,
  frag: newFrag,
}

// STATIC CONFIG
// ----------------------------------
// Attribute values
const attr = {
  include: includeAttr || 'include',
  inline: inlineAttr || 'inline',
}


// EXPORT
// ----------------------------------
module.exports = {
  attr,
  convertExternalLinks,
  getFileParts,
  getPaths,
  hasExtension,
  isAllowedType,
  isExtension,
  jsdom,
  setSrc,
  testSrc,
};


// METHODS AND CONSTS
// ----------------------------------

/**
 * @description Get a new JSDOM document/object from the passed in string source
 * @docs https://github.com/jsdom/jsdom
 * @param {Object} opts - The arguments object
 * @property {String} fileSource - The source to make a traversable document from
 * @property {Object} [options] - Optional JSDOM options config object
 * @returns {Object}
 */
function newJSDOM({src,options}) {
  const opts = options || { url: jsdom.baseUrl };
  return new JSDOM(src, opts);
}

/**
 * @description Get a new JSDOM fragment from the passed in string source
 * @docs https://github.com/jsdom/jsdom
 * @param {Object} opts - The arguments object
 * @property {String} fileSource - The source to make a traversable document from
 * @returns {Object}
 */
function newFrag({src}) {
  return JSDOM.fragment(src);
}

/**
 * @description Find all href="www.xxxx.com" links and add http:// protocol. 
 * By using the <base> tag, www links w/o a protocol are treated as internal (relative) links and will 404
 * @param {*} source 
 * @return {String}
 * @private
 */ 
function convertExternalLinks(source) {
  return source.replace(/href="www/gi, 'href="http://www');
}

/**
 * @description Return object with filename `name` and `extension`
 * @param {path} - The file path (/path/to/file.ext)
 * @return {Object}
 * @private
 */ 
function getFileParts(path) {
  const fileSplit = path.split('/');
  const fileName = fileSplit[fileSplit.length - 1].split('.');
  return { name: fileName[0], ext: fileName[1] };
}

/**
 * @description Recursively grab all paths in a folder structure
 * @param {String} originalPath - The previous path
 * @param {String} path - The new path to explore
 * @param {RegExp} ignorePattern - A regex pattern to ignore certain files and folders
 * @param {Array} paths - The on going list of paths found
 * @return {Array} - An array of paths
 * @private
 */
function getPaths(originalPath, path, ignorePattern, paths = []) {
  try {
    // Obtain a list of files and folders
    const files = fs.readdirSync(path);
    files.forEach(file => {
      const currentFilePath = `${path}/${file}`;
      // Get the file descriptor
      const fd = fs.lstatSync(currentFilePath);
      // If path is ignored, either by default or user-entered (`excludePaths` in /config/main.js),
      // We won't do anything to it once it is copied to /dist
      // This is handy for `/dist/vendor`, for example, since that is code likely already minified
      // and outside of the user's control
      let allowed = true, pattern, match;
      if (ignorePattern) {
        ignorePattern.forEach(p => {
          pattern = new RegExp(p, 'g');
          match = currentFilePath.match(pattern);
          if (match && match.length) allowed = false;
        })
      }
      // Include file to use in build process
      if (allowed) {
        if (fd.isDirectory()) {
          paths = [...paths, ...getPaths(originalPath, currentFilePath, ignorePattern)];
        } else {
          paths.push(currentFilePath);
        }
      }
    });
    return paths;
  } catch (error) {
    throw error;
  }
}

/**
 * @description Check if path string has extension. Protects against directory names with `.` characters
 * @property {String} str - Path string to test
 * @returns {Boolean}
 * @private
 */
function hasExtension(str) {
  const is2LengthExt = str[str.length - 3] === '.';
  const is3LengthExt = str[str.length - 4] === '.';
  const is4LengthExt = str[str.length - 5] === '.';
  return is2LengthExt || is3LengthExt || is4LengthExt;
}

/**
 * @description Pass in an 'opt-in' or 'opt-out' array to match current file against by extension type
 * @param {Object} opts - The argument object
 * @property {String} fileExt - The extension of the file
 * @property {Object} [allowType] - The array of extensions to allow
 * @property {String} [disallowType] - The array of extensions to disallow
 * @returns {Boolean}
 * @private
 */
function isAllowedType({file,allowType,disallowType}) {
  let {ext} = file;
  ext = ext.charAt(0) === '.' ? ext : `.${ext}`;
  // If file extension NOT in allowed array, return false
  if (allowType && allowType.indexOf(ext) === -1) return false;
  // If file extension IS in disallowed array, return false
  if (disallowType && disallowType.indexOf(ext) > -1) return false;
  return true;
}

/**
 * @description Return pattern match to `.html`
 * @param {String} fileName - The target string
 * @param {Array|String} target - The target extension(s) (html, js, etc.)
 * @private
 */
function isExtension(fileName, target) {
  const isString = typeof target === 'string';
  const ext = fileName.split('.').pop();
  if (isString) return ext === target;
  else return target.indexOf(ext) > -1;
}

/**
 * @description Get the correct DOM nodes as a string
 * @param {*} param0 
 */
function setSrc({dom}) {
  const document = dom.window.document;
  const isBodyFrag = document.head.children.length < 1;
  const isHeadFrag = document.body.children.length < 1;
  // Is a fragment .html file (likely include) that <head> is empty
  if (isBodyFrag) return document.body.innerHTML;
  // Is a fragment .html file (likely include) that <body> is empty
  else if (isHeadFrag) return document.head.innerHTML;
  // Is a full DOM .html page w/ doctype, <html>, etc. Just return the whole thing
  else return dom.serialize();
}

/**
 * @description Output source for only a few pages for testing
 * @example utils.testSrc({file});
 * @param {Object} opts - The arguments object 
 * @property {Object} file - The current file's info (ext,name,path,src)
 */
function testSrc({file}) {
  const test = ['dist/plugin/zc-obfuscate/zc-obfuscate.js','dist/index.html','dist/includes/global-head.html','dist/css/main.css'];
  if (test.indexOf(file.path) > -1) console.log(`\n----------------------\n\n${chalk.blue(file.path)}\n\n${file.src}\n`);
}