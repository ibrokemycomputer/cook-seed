/**
 * @file minify-src.js
 * @description Remove `/dist` and recreate it
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const minifyCss = require('clean-css');
const minifyHtml = require('html-minifier').minify;
const minifyJs = require('uglify-es');
const utils = require(`${cwd}/scripts/utils/util.js`);
const Logger = require(`${cwd}/scripts/utils/logger.js`);

// Config
const {distPath} = require(`${cwd}/config/main.js`);


// PLUGIN OPTIONS
// -----------------------------
// Minfiy CSS
const minifyCssConfig = {};

// Minfiy HTML
const minifyHtmlConfig = {
  collapseWhitespace: true,
  removeAttributeQuotes: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
}

// Minfiy JS
const minifyJsConfig = {};


// DEFINE
// -----------------------------
async function minifySrc() {
  // Early Exit: Don't minify in development
  if (process.env.NODE_ENV === 'development') return;

  // Show terminal message: Start
  console.log(chalk.grey.underline(`\nMinify Source Files`));

  // Files to minify
  const allowedExt = ['css','html','js'];
  // Get files in `/dist`
  let files = utils.getPaths(distPath, distPath, null);
  // Get only the allowed extension files
  files = files.filter(fileName => utils.isExtension(fileName, allowedExt));
  // Minify source
  await files.forEach(fileName => minifySource(fileName));

  // Show terminal message
  Logger.success(`Files minified`);
}


// MINIFY SOURCE
// -----------------------------
/**
 * @description Minify target file content
 * @param {String} fileName - The current file to act upon.
 * @private
 */
function minifySource(fileName) {
  const ext = fileName.split('.').pop();
  const fileSource = fs.readFileSync(fileName, 'utf-8');
  // HTML
  let minifiedSrc = fileSource;
  switch (ext) {
    case 'css': minifiedSrc = minCss(fileSource); break;
    case 'html': minifiedSrc = minHtml(fileSource); break;
    case 'js': minifiedSrc = minJs(fileSource); break;
  }
  // Write new, minified code back to the /dist file
  fs.writeFileSync(fileName, minifiedSrc);
}


// PRIMARY MINIFY METHODS
// -----------------------------
function minHtml(src) {
  // MINIFY HTML
  let minSrc = minifyHtml(src, minifyHtmlConfig);
  // Load new, minified html source into Cheerio for traversing
  const $ = cheerio.load(minSrc, utils.cheerioConfig);
  // MINIFY INLINE CSS
  minifyInlineCss($('style'), $);
  // MINIFY INLINE SCRIPTS
  minifyInlineJs($('script'), $);
  // Return updated source
  return $.html();
}

function minJs(src) {
  return minifyJs.minify(src, minifyJsConfig).code;
}

function minCss(src) {
  return new minifyCss(minifyCssConfig).minify(src).styles;
}


// HELPER METHODS
// -----------------------------

/**
 * @description Minify inline `<style>` tags
 * @param {Object} el - The current `<style>` tag
 * @param {Object} $ - The cheerio DOM object representing the source (traversable)
 * @private
 */
function minifyInlineCss(group, $) {
  let src, minifiedSrc;
  group.each((i,el) => {
    // The 'inner' content of the `<style>` tag
    src = el.children[0] ? el.children[0].data : '';
    // Minify content
    minifiedSrc = minCss(src);
    // Updated `<style>` with new minified source
    $(el).text(minifiedSrc);
  });
}

/**
 * @description Minify inline `<script>` tags
 * @param {Object} el - The current `<script>` tag
 * @param {Object} $ - The cheerio DOM object representing the source (traversable)
 * @private
 */
function minifyInlineJs(group, $) {
  let src, minifiedSrc;
  group.each((i,el) => {
    // The 'inner' content of the `<script>` tag
    src = el.children[0] ? el.children[0].data : '';
    // Minify content
    minifiedSrc = minJs(src);
    // Updated `<script>` with new minified source
    $(el).text(minifiedSrc);
  });
}

// EXPORT
// -----------------------------
module.exports = minifySrc;