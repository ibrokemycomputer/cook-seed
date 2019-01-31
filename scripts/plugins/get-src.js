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
const {distPath,srcPath} = require(`${cwd}/config/main.js`);


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
  const $ = cheerio.load(fileSource, utils.cheerioConfig);
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

  // Allowed page types
  const allowedExt = ['css','html','js'];
  // Get files in `/dist`
  let files = utils.getPaths(distPath, distPath, null);
  // Get only the allowed files (.css, .html)
  files = files.filter(fileName => utils.isExtension(fileName, allowedExt));
  // Run tasks on matched files
  // await files.forEach(fileName => replaceContent(fileName));
  if (cb) cb(files);
}

// HELPER METHODS
// -----------------------------


// EXPORT
// -----------------------------
module.exports = {
  getSrcConfig,
  getSrcFiles,
};