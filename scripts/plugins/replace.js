/**
 * @file replace.js
 * @description Replace source content. All plugins that modify file contents should run here
 * instead of in `build.js`. This way we only need to load and write to the file once,
 * instead of in each individual plugin.
 * - replaceIncludes - Replace 'include' markers with corresponding code
 * - replaceInline - Replace external '<link>' and `<script>` tags with `[inline]` as inlined content
 * - replaceSrcPathForDev - Replace `/src` paths in dev since we don't inline in that environment
 * - setActiveLinks - Match `<a>` against current page url and add active state if they match
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const utils = require(`${cwd}/scripts/utils/util.js`);
const Logger = require(`${cwd}/scripts/utils/logger.js`);

// Config
const {distPath,srcPath} = require(`${cwd}/config/main.js`);


// DEFINE
// -----------------------------
async function replace(cb) {
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
module.exports = replace;