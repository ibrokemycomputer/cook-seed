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
const {srcPath,distPath} = require(`${cwd}/config/main.js`);


// PLUGIN OPTIONS
// -----------------------------
// Minfiy CSS
const minifyCssConfig = {
  inline: ['none'],
};

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
function minifySrc({$, fileExt, fileName, allowType, disallowType}) {
  // Early Exit: File type not allowed
  const allowed = utils.isAllowedType({fileExt,allowType,disallowType});
  if (!allowed) return;

  // Early Exit: Don't minify in development
  if (process.env.NODE_ENV === 'development') return;

  const fileSource = utils.getSrc({$, fileExt});
  let minifiedSrc;
  switch (fileExt) {
    case 'css': minifiedSrc = minCss(fileSource,fileName); break;
    case 'html': minifiedSrc = minHtml(fileSource); break;
    case 'js': minifiedSrc = minJs(fileSource); break;
  }

  // Show terminal message
  Logger.success(`${fileName} - Minified`);

  // Return minified source
  return minifiedSrc;
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

function minCss(src,fileName) {
  // Minify src
  let minifiedCSS = new minifyCss(minifyCssConfig).minify(src).styles;  
  // Check for @import and replace them with their source
  const pattern = /@import\s*url\(([/.)a-z]*);/gim;
  const matches = minifiedCSS.match(pattern);
  if (matches) minifiedCSS = replaceImports({matches,src: minifiedCSS});
  // Return minified source
  return minifiedCSS;
}


// HELPER METHODS
// -----------------------------

/**
 * @description
 * @param {Object} opts - The argument object
 * @property {Array} matches - Array of matched `@import url(...)` strings 
 * @property {Array} src - The source string to replace the matches against
 * @returns {String}
 * @private
 */
// TODO: The regex could likely be done a little nicer if we could use lookbehinds.
// Instead for now, the pattern matches: url(/css/variables.css
// so we just lop off the first four characters
function replaceImports({matches,src}) {
  let path, replaceSrc, modifiedSrc = src;
  matches.forEach((entry,i) => {
    path = entry.match(/url\(.*(?=\))/gim)[0].slice(4);
    // Get source to replace
    replaceSrc = fs.readFileSync(`${srcPath}/${path}`, 'utf-8');
    // Minimize it
    replaceSrc = new minifyCss(minifyCssConfig).minify(replaceSrc).styles;
    // Replace @import with source
    modifiedSrc = modifiedSrc.replace(entry, replaceSrc);
  });
  return modifiedSrc;
}

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