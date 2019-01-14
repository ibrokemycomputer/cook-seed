/**
 * @file replace-includes.js
 * @description Replace include markers with corresponding code
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const utils = require(`${cwd}/scripts/utils/util.js`);
const Logger = require(`${cwd}/scripts/utils/logger.js`);

// Config
const {srcPath} = require(`${cwd}/config/main.js`);


// DEFINE
// -----------------------------
async function replaceIncludes({$, fileName}) {
  let errorLabel, errorPath, hasInclude, includePath;
  const includeItems = $(`[${utils.attr.include}]`);
  includeItems.each((i,el) => {
    // If attribute found and it has a path
    hasInclude = $(el).attr(utils.attr.include);
    if (hasInclude && hasInclude.length) {
      try {
        includePath = path.resolve(`${srcPath}/${hasInclude}`);
        // Get contents of target include file
        const content = fs.readFileSync(includePath, 'utf-8');
        // Add include content before placeholder element
        $(el).before(content);
        // Remove placeholder element
        $(el).remove();
        // Show terminal message
        Logger.success(`${fileName} - Replaced [${utils.attr.include}]: ${ chalk.green(hasInclude) }`);
      }
      catch (error) {
        errorLabel = `Invalid include path in '${fileName}`;
        errorPath = error.path.split(cwd)[1];
        Logger.error(`${errorPath}\n${ chalk.red(errorLabel) }`);
      }
    }
  });
  // Query again for includes. If sub-includes found, run again
  const newSubIncludes = $(`[${utils.attr.include}]`);
  if (newSubIncludes.length) replaceIncludes({$, fileName});
}


// EXPORT
// -----------------------------
module.exports = replaceIncludes;