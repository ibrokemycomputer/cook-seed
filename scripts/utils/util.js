// REQUIRE
// ----------------------------------
const cwd = process.cwd();
const fs = require('fs');

// Config
const {includeAttr,inlineAttr} = require(`${cwd}/config/main.js`);


// STATIC CONFIG
// ----------------------------------
// Attribute values
const attr = {
  include: includeAttr || 'include',
  inline: inlineAttr || 'inline',
}

// Config for Cheerio
const cheerioConfig = {
  // Don't convert html entities (won't parse correctly otherwise)
  decodeEntities: false,
  // Don't wrap fragment `.html` files with `<html>`, `<body>`, etc.
  // xmlMode: true,
  recognizeSelfClosing: true,
}


// PUBLIC METHODS
// ----------------------------------

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
 * @description Return traversable cheerio 'dom' object with updated changes.
 * @param {Object} Opts - Argument object
 * @property {Object} $ - The traversable cheerio file source
 * @property {String} fileExt - The target file extension
 * @return {Object}
 * @private
 */
function getSrc({$, fileExt}) {
  // NOTE: Using `$('body').html()` instead of `$.html()` for non-html files, 
  // since the latter wraps the source in full dom tree (html,head,body,etc.)
  return fileExt === 'html' ? $.html() : $('body').html();
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
      if (!currentFilePath.match(ignorePattern)) {
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

// EXPORT
// ----------------------------------
module.exports = {
  attr,
  cheerioConfig,
  convertExternalLinks,
  getFileParts,
  getPaths,
  getSrc,
  isExtension,
};