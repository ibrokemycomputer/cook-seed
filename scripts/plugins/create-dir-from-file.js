/**
 * @file create-dir-from-file.js
 * @description Change all `xxxx.html` pages into `xxxx/index.html` versions so you
 * don't need to show extensions in the url
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const fs = require('fs-extra');
const rimraf = require('rimraf');
const utils = require(`${cwd}/scripts/utils/util.js`);
const Logger = require(`${cwd}/scripts/utils/logger.js`);

// Config
const {distPath} = require(`${cwd}/config/main.js`);

// DEFINE
// -----------------------------
async function createDirFromFile({$, fileExt, fileName, allowType, disallowType, excludePath}) {
  // Early Exit: File type not allowed
  const allowed = utils.isAllowedType({fileExt,allowType,disallowType});
  if (!allowed) return;

  // Get file extension
  const fileNameSplit = fileName.split('.');
  const filePath = fileNameSplit[0];

  // Early Exit: Path includes excluded pattern
  // For example, we don't want to convert the site index file (homepage)
  const isExcludeMatch = excludePath.filter(str => filePath.includes(str));
  if (excludePath && isExcludeMatch.length) return;

  // Create new directory in `/dist`
  fs.mkdirSync(filePath);

  // Create new .html file in newly created directory
  fs.writeFileSync(`${filePath}/index.html`, utils.getSrc({$, fileExt}));

  // Show terminal message: Done
  Logger.success(`${fileName} - Added [directory]: ${ chalk.green(filePath + '/index.html' ) }`);
}

// EXPORT
// -----------------------------
module.exports = createDirFromFile;