/**
 * @file replace.js
 * @description Replace source content. All plugins that modifies file contents should run here
 * instead of in `build.js`. This way we only need to load and write to the file once,
 * instead of in each individual plugin.
 * - Includes - Replace 'include' markers with corresponding code
 * - Inline - Replace external '<link>' and `<script>` tags with `[inline]` as inlined content
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const cheerio = require('cheerio');
const chalk = require('chalk');
const fs = require('fs');
const utils = require(`${cwd}/scripts/utils/util.js`);
//const Logger = require(`${cwd}/scripts/utils/logger.js`);

// Config
const {distPath,srcPath} = require(`${cwd}/config/main.js`);


// Plugins
const replaceIncludes = require('./replace-includes.js');
const replaceInline = require('./replace-inline.js');
const replaceSrcPathForDev = require('./replace-src-path.js');
const setActiveLinks = require('./set-active-links.js');


// DEFINE
// -----------------------------
async function replace() {
  // Show terminal message: Start
  console.log(chalk.grey.underline('\nReplace Tasks'));

  // Allowed page types
  const allowedExt = ['css','html'];
  // Get files in `/dist`
  let files = utils.getPaths(distPath, distPath, null);
  // Get only the allowed files (.css, .html)
  files = files.filter(fileName => utils.isExtension(fileName, allowedExt));
  // Run tasks on matched files
  await files.forEach(fileName => replaceContent(fileName));
}

// HELPER METHODS
// -----------------------------
/**
 * @description Run tasks on matched file. We run all of the plugins here instead
 * of in `build.js` so we don't have to load/write the file multiple times per plugin.
 * Instead, we pass in the current state of the file contents (`$`) so we can pipe
 * new changes to it. When done, we `writeFileSync()` the new changes back to the file.
 * @param {String} fileName - The file currently being worked on
 * @return {String} - An ES5 HTML document
 * @private
 */
function replaceContent(fileName) {
  // Store filename parts
  const {ext,name} = utils.getFileParts(fileName);
  // Get file source
  const fileSource = fs.readFileSync(fileName, 'utf-8');
  // Load file content for traversing
  const $ = cheerio.load(fileSource, utils.cheerioConfig);
  
  // 1. Replace all `[include]` in file
  replaceIncludes({$, fileName});

  // 2. Inline all external `<link>` and `<script>` tags with `[inline]`
  replaceInline({$, fileName});
  // 3. `/src` is needed for `@import url()` calls when inlining source
  // Since we don't inline in 'development' mode, we need to remove `/src` paths
  // since `/src` doesn't exist in `/dist`
  replaceSrcPathForDev({$, fileName, fileSource});

  // 4. Find `<a>` tags whose [href] value matches the current page (link active state)
  setActiveLinks({$, fileName});

  // Replace file source with changes
  // NOTE: Using `$('body').html()` instead of `$.html()` for non-html files, 
  // since the latter wraps the source in full dom tree (html,head,body,etc.)
  const srcType = ext === 'html' ? $.html() : $('body').html();
  fs.writeFileSync(fileName, srcType);
}


// EXPORT
// -----------------------------
module.exports = replace;