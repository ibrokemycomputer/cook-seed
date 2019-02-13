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
async function replaceSrcPathForDev({file, allowType, disallowType}) {
  // Early Exit: File type not allowed
  const allowed = utils.isAllowedType({file,allowType,disallowType});
  if (!allowed) return;

  // Set regex and do matching
  const targetRegex = new RegExp(`\(\/${srcPath}.+(?=\))`, 'gim');
  const matches = file.src.match(targetRegex);
  // For each found match, replace it by slicing off the first X characters from the path,
  // based on the length of the `src` directory name set in config `config/main.js` file.
  // By default, this is `src`. Therefore, given a css path like `/src/css/ex.css` we
  // want to slice off the leading `/` and then `src`, which is 4 characters total (`srcPath.length+1`)
  if (matches) file.src = replacePath({file, matches})
}


// HELPER METHODS
// -----------------------------

/**
 * @description Replace `/src` path with `/dist`-appropriate path.
 * @param {Object} opts - Argument options object
 * @property {String} match - The string match to modify
 * @property {String} fileName - The current file path for display
 * @property {String} fileSource - The current file's source for modifying
 * @returns {String}
 * @private
 */
function replacePath({file, matches}) {
  let newPath;
  matches.forEach((m,i) => {
    newPath = m.slice(srcPath.length+1);
    file.src = file.src.replace(m, newPath);
    // Show terminal message
    Logger.success(`${file.path} - Replaced [${m.slice(0, -2)}]: ${ chalk.green(newPath.slice(0, -2)) }`);
  });
  return file.src;
}


// EXPORT
// -----------------------------
module.exports = replaceSrcPathForDev;