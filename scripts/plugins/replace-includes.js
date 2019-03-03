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
const {distPath,srcPath} = require(`${cwd}/config/main.js`);


// DEFINE
// -----------------------------
async function replaceIncludes({file, allowType, disallowType}) {
  // Early Exit: File type not allowed
  const allowed = utils.isAllowedType({file,allowType,disallowType});
  if (!allowed) return;
  
  let errorLabel, errorPath, hasInclude, includePath;
  let dom = utils.jsdom.dom({src: file.src});
  const includeItems = dom.window.document.querySelectorAll(`[${utils.attr.include}]`);

  // Early Exit: No includes
  if (!includeItems) return;

  // Loop through each found include call
  includeItems.forEach((el,i) => {

    // If attribute found and it has a path
    hasInclude = el.getAttribute(utils.attr.include);
    if (hasInclude && hasInclude.length) {
      try {
        includePath = path.resolve(`${distPath}/${hasInclude}`);
        // If you are pointing to an include w/o the `.html` extension
        // We'll add it since the directory-replacement only occurs in /dist (See `createDirFromFile()` in build.js)
        // Example: `<div include="/includes/header"></div>`
        //   In /dist, the build process creates `/dist/includes/header/index.html`
        //   But, in /src, we only have `/src/includes/header.html`, hence this check
        const hasExtension = utils.hasExtension(includePath);
        includePath = hasExtension ? includePath : `${includePath}.html`;
        // Get contents of target include file
        const content = fs.readFileSync(includePath, 'utf-8');
        // Add included content in DOM before placeholder element
        el.insertAdjacentHTML('beforebegin', content);
        // Remove placeholder element from DOM
        el.remove();
        // Show terminal message
        Logger.success(`${file.path} - Replaced [${utils.attr.include}]: ${ chalk.green(hasInclude) }`);
      }
      catch (error) {
        errorLabel = `Invalid include path in '${file.path}`;
        errorPath = error.path.split(cwd)[1];
        Logger.error(`${errorPath}\n${ chalk.red(errorLabel) }`);
      }
    }
  });

  // Store updated file source
  file.src = utils.setSrc({dom});
  
  // Query again for includes. If sub-includes found, run again
  dom = utils.jsdom.dom({src: file.src});
  const newSubIncludes = dom.window.document.querySelectorAll(`[${utils.attr.include}]`);
  if (newSubIncludes.length) replaceIncludes({file, allowType, disallowType});
}


// EXPORT
// -----------------------------
module.exports = replaceIncludes;