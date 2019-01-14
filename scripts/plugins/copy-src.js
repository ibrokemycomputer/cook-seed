/**
 * @file copy-src.js
 * @description Copy contents of `/src` to `/dist`
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const fs = require('fs-extra');
const Logger = require(`${cwd}/scripts/utils/logger.js`);
const { exec } = require('child_process');

// Config
const {distPath,srcPath} = require(`${cwd}/config/main.js`);

// DEFINE
// -----------------------------
async function copySrc() {
  // Show terminal message: Start
  console.log(chalk.grey.underline('\nCopy /src to /dist'));

  // Copy contents of `/src` to `/dist`
  // await exec(`cp -a ${srcPath}/. ${distPath}`);
  await fs.copy(srcPath, distPath);

  // Show terminal message
  Logger.success(`Content from /${srcPath} copied to /${distPath}`);
}


// EXPORT
// -----------------------------
module.exports = copySrc;