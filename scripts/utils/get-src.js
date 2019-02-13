/**
 * @file get-src.js
 * @description Get allowed source files for modification
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const fs = require('fs');
const utils = require(`${cwd}/scripts/utils/util.js`);
const Logger = require(`${cwd}/scripts/utils/logger.js`);

// Config
const {excludePaths,distPath,srcPath} = require(`${cwd}/config/main.js`);


// EXPORT
// -----------------------------
module.exports = {
  getSrcConfig,
  getSrcFiles,
};


// PUBLIC METHODS
// -----------------------------

/**
 * @description - Store information for use in build plugins based on the current file
 * @param {Object} Opts - Argument object
 * @property {String} fileName - The filename of the targeted file 
 * @returns {Object}
 * @private
 */
async function getSrcConfig({fileName}) {
  // Init obj
  let file = {};
  
  // Store filename parts
  let {ext,name} = utils.getFileParts(fileName);
  file.ext = ext;
  file.name = name;
  file.path = fileName;
  
  // Get file source
  file.src = fs.readFileSync(fileName, 'utf-8');
  // Sanitize comments that have non-closing html elements in them. JSDOM will try to close it in the DOM
  // but since there is no starting tag (it's in the comment) it will break the dom
  file.src = removeCommentTags(file.src);
  
  // Get JSDOM parts
  // const document = utils.jsdom.dom({fileSource}).window.document;

  // Return config object
  // return { document, fileSource, fileExt: ext };
  return file;
}

/**
 * @description - Return all allowed files for the build process
 * @param {Object} cb - The callback function once the files have been grouped
 * @private
 */
async function getSrcFiles(cb) {
  // Show terminal message: Start
  Logger.header('\nReplace Tasks');

  // Disallowed page types
  // /dist/vendor - Skip 3rd-party vendor files
  const defaultExcludedPaths = [new RegExp(`${distPath}\/vendor`)];
  const userExcludedPaths = validatePaths(excludePaths);
  const excludedPaths = [...defaultExcludedPaths, ...userExcludedPaths];
  // Allowed page extensions
  const allowedExt = ['css','html','js'];
  // Get files in `/dist`
  let files = utils.getPaths(distPath, distPath, excludedPaths);
  // Get only the allowed files by extension (.css, .html)
  files = files.filter(fileName => utils.isExtension(fileName, allowedExt));
  // Run tasks on matched files
  if (cb) cb(files);
}


// HELPER METHODS
// -----------------------------

/**
 * @description Remove < and > from comments since non-closed tags
 * will have the matching end tag added
 */
function removeCommentTags(src) {
  const commentsRegex = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
  const matches = src.match(commentsRegex); 
  if (!matches) return src;
  let replaces;
  matches.forEach(m => {
    replaces = m.replace('<', '').replace('>', '');
    src = src.replace(m, replaces);
  })
  return src;
}

// HELPER METHODS
// -----------------------------

/**
 * @description Validate user entry and return in array if valid
 * @param {*} paths - User entry to validate. If a valid, single regex, add to array and return
 * @returns {Array}
 * @private
 */
function validatePaths(paths) {
  let pathArr = [];
  // If user already added as array, just use that
  if (paths && paths.length) return paths;
  // If user gave a single regex, add it to an array
  if (paths && typeof paths === 'object' && !paths.length) pathArr.push(paths);
  // Return an array with either valid user regex(es) or an empty array
  return pathArr;
}