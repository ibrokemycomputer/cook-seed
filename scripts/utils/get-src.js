/**
 * @file get-src.js
 * @description Get allowed source files for modification
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const cheerio = require('cheerio');
const fs = require('fs');
const utils = require(`${cwd}/scripts/utils/util.js`);
const Logger = require(`${cwd}/scripts/utils/logger.js`);

// Config
const {excludePaths,distPath,srcPath} = require(`${cwd}/config/main.js`);


// HELPER METHODS
// -----------------------------

/**
 * @description - Store information for use in build plugins based on the current file
 * @param {Object} Opts - Argument object
 * @property {String} fileName - The filename of the targeted file 
 * @returns {Object}
 * @private
 */
async function getSrcConfig({fileName}) {
  // Store filename parts
  const {ext,name} = utils.getFileParts(fileName);
  // Get file source
  const fileSource = fs.readFileSync(fileName, 'utf-8');
  
  // Load file content into Cheerio for dom traversal
  let $;
  if (fileName === 'dist/plugin/zc-obfuscate/zc-obfuscate.js') {
    console.log('fileSource', fileSource)
  }
  if (ext === 'html') $ = cheerio.load(fileSource, utils.cheerioConfig);
  else $ = cheerio.load(fileSource, utils.cheerioConfigDecode);

  // Return config object
  return { $, fileSource, fileExt: ext };
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

/**
 * @description - Rebind Cheerio with newly modified source instead of the starting file source
 * @param {Object} Opts - Argument object
 * @property {String} fileName - The filename of the targeted file 
 * @property {String} src - The new source
 * @returns {Object}
 * @private
 */
async function rebindCheerio({fileName,src}) {
  // Store filename parts
  const {ext,name} = utils.getFileParts(fileName);
  // Load file content into Cheerio for dom traversal
  let $;
  // Don't decode .html page code, but do .css and .js
  if (ext === 'html') $ = cheerio.load(src, utils.cheerioConfig);
  else $ = cheerio.load(src, utils.cheerioConfigDecode);
  // Return config object
  return $;
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


// EXPORT
// -----------------------------
module.exports = {
  getSrcConfig,
  getSrcFiles,
  rebindCheerio,
};