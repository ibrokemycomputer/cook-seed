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
function createDirFromFile({$, fileName, exclude}) {
  // Get file extension
  const fileNameSplit = fileName.split('.');
  const fileExt = fileNameSplit[1];

  // Early Exit: File is not .html
  if (fileExt !== 'html') return;

  // Early Exit: Path includes excluded pattern
  // For example, we don't want to convert the site index file (homepage)
  const isExcludeMatch = exclude.filter(str => fileNameSplit[0].includes(str));
  if (exclude && isExcludeMatch.length) return;

  // Using example path of: `/dist/path/to/this/file.html`
  // ---
  // Split `/dist/path/to/this/file` on /
  const filePath = fileNameSplit[0];
  const pathSplit = filePath.split('/');
  const pathLen = pathSplit.length;
  // Store the file's name. We'll create the new directory with this name
  const newDirName = pathSplit[pathLen-1];
  // Get path to this location. We'll create the directory here
  // Example: 
  //   File path is `/dist/path/to/this/file.html` 
  //   `pathSplit` is: [ 'dist', 'path', 'to', 'this', 'file' ]
  //   `newDirPath` then becomes: `/dist/path/to/this` so we can add `file` directory here w/ an `index.html` file
  const newDirPath = pathSplit.reduce((acc,curr,index) => index !== pathLen-1 ? acc += `/${curr}` : acc, '');

  // Create new directory in `/dist`
  fs.mkdirSync(filePath);

  // Create new .html file in newly created directory
  fs.writeFileSync(`${filePath}/index.html`, utils.getSrc({$, fileExt}));
  
  // Show terminal message: Done
  Logger.success(`${fileName} - Added [directory]: ${ chalk.green(newDirPath + '/' + newDirName + '/index.html' ) }`);
}

// EXPORT
// -----------------------------
module.exports = createDirFromFile;