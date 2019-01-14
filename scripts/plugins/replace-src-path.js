/**
 * @file replace-src-path.js
 * @description Replace `/src` paths for `NODE_ENV=development` since we do not inline `[inline]` elements locally,
 * so the `@import url()` path cannot start with `/src`, since that doesn't exist in the `/dist` folder
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const fs = require('fs-extra');
const utils = require(`${cwd}/scripts/utils/util.js`);
const Logger = require(`${cwd}/scripts/utils/logger.js`);

// Config
const {distPath,srcPath} = require(`${cwd}/config/main.js`);


// DEFINE
// -----------------------------
async function replaceSrcPathForDev({$, fileName, fileSource}) {
  // Get filename parts
  const {ext,name} = utils.getFileParts(fileName);
  // For .css files only, and only for local development, replace `/src` in CSS imports
  if (process.env.NODE_ENV === 'development' && ext === 'css') {
    const targetRegex = new RegExp(`\(\/${srcPath}.+(?=\))`, 'gim');
    const matches = fileSource.match(targetRegex);
    // For each found match, replace it by slicing off the first X characters from the path,
    // based on the length of the `src` directory name set in config `config/main.js` file.
    // By default, this is `src`. Therefore, given a css path like `/src/css/ex.css` we
    // want to slice off the leading `/` and then `src`, which is 4 characters total (`srcPath.length+1`)
    if (matches) matches.forEach(m => fileSource = replacePath({fileName, fileSource, match: m}));
    // Set new, updated source
    // NOTE: Using `$('body').html()` instead of `$.html()` b/c the latter wraps
    // the output in dom-tree wrapper (html,head,body,etc.)
    // With `$('body').html()` we just write back the contents of `.css` file,
    // which is the '<body>' element content (css source)
    $('body').html(fileSource);
  }
}


// HELPER METHODS
// -----------------------------

/**
 * @description Replace `/src` path with `/dist`-appropriate path.
 * @param {Object} opts - Argument options object
 * @property {String} match - The string match to modify
 * @property {String} fileName - The current file path for display
 * @property {String} fileSource - The current file's source for modifying
 */
function replacePath({match, fileName, fileSource}) {
  const newPath = match.slice(srcPath.length+1);
  // Show terminal message
  Logger.success(`${fileName} - Replaced [${match.slice(0, -2)}]: ${ chalk.green(newPath.slice(0, -2)) }`);
  // Return updated path
  return fileSource.replace(match, newPath);
}


// EXPORT
// -----------------------------
module.exports = replaceSrcPathForDev;