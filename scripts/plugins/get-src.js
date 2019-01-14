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

async function getSrcConfig({fileName}) {
  // Store filename parts
  const {ext,name} = utils.getFileParts(fileName);
  // Get file source
  const fileSource = fs.readFileSync(fileName, 'utf-8');
  // Load file content for traversing
  const $ = cheerio.load(fileSource, utils.cheerioConfig);
  // Return config items
  return { $, fileSource, fileExt: ext };
}

async function getSrcFiles(cb) {
  // Show terminal message: Start
  Logger.header('\nReplace Tasks');

  // Allowed page types
  const allowedExt = ['css','html'];
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