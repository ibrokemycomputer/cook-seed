/**
 * @file minify-src.js
 * @description Remove `/dist` and recreate it
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const fs = require('fs-extra');
const minifyCss = require('clean-css');
const minifyHtml = require('html-minifier').minify;
const minifyEs = require('uglify-es');
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
function minifySrc({file, allowType, disallowType}) {

  // Early Exit: File type not allowed
  const allowed = utils.isAllowedType({file,allowType,disallowType});
  if (!allowed) return;

  // Early Exit: Don't minify in development
  if (process.env.NODE_ENV === 'development') return;

  // Minify source differently based on the file type  
  let newSrc;
  switch (file.ext) {
    case 'css': newSrc = minCss({file}); break;
    case 'html': newSrc = minHtml({file}); break;
    case 'js': newSrc = minJs({file}); break;
  }

  // Store new source
  file.src = newSrc;

  // Show terminal message
  Logger.success(`${file.path} - Minified`);
}


// PRIMARY MINIFY METHODS
// -----------------------------
function minHtml({file}) {
  // MINIFY HTML
  file.src = minifyHtml(file.src, minifyHtmlConfig);
  // MINIFY INLINE CSS
  file.src = minifyInline(file, 'style', minCss);
  // MINIFY INLINE SCRIPTS
  file.src = minifyInline(file, 'script', minJs);
  // Return new src
  return file.src;
}

function minJs({file}) {
  return minifyEs.minify(file.src, minifyJsConfig).code;
}

function minCss({file}) {
  // Minify source
  file.src = new minifyCss(minifyCssConfig).minify(file.src).styles;
  // Replace '@import' calls with their inlined source
  file.src = replaceCssImports({file});
  // Return modified file source
  return file.src;
}


// HELPER METHODS
// -----------------------------

/**
 * @description
 * @param {Object} opts - The argument object
 * @property {Object} file - The file source properties (ext,name,path,src)
 * @private
 */
// TODO: The regex could likely be done a little nicer if we could use lookbehinds.
// Instead for now, the pattern matches: url(/css/variables.css
// so we just lop off the first four characters
function replaceCssImports({file}) {
  let path, replaceSrc;
  // Check for @import and replace them with their source
  const pattern = /@import\s*url\(([/.\_\-)a-z]*);/gim;
  const matches = file.src.match(pattern);
  if (matches) {
    matches.forEach((m,i) => {
      path = m.match(/url\(.*(?=\))/gim)[0].slice(4);
      // If path has /src at the start, strip it off
      path = path.replace(/^\/src/, '');
      // Get source to replace
      replaceSrc = fs.readFileSync(`${srcPath}${path}`, 'utf-8');
      // Minimize it
      replaceSrc = new minifyCss(minifyCssConfig).minify(replaceSrc).styles;
      // Replace @import with source
      // console.log('\nsrc', fileSource.src)
      file.src = file.src.replace(m, replaceSrc);
    });
  }
  return file.src;
}

/**
 * @description Minify inline `<style>` tags
 * @param {Object} file - The current file items (ext,name,path,src)
 * @param {String} selector - The html element string selector for querying
 * @param {Object} type - The minification method to use
 * @private
 */
function minifyInline(file, selector, type) {
  const dom = utils.jsdom.dom({src: file.src});
  const group = dom.window.document.querySelectorAll(selector);
  let minifiedSrc;
  group.forEach((el,i) => {
    file.src = el.textContent;
    // Minify content
    minifiedSrc = type({file});
    // Update tag with new minified source
    el.textContent = minifiedSrc;
  });
  // Store updated file source
  file.src = utils.setSrc({dom});
  // Return updated file source
  return file.src;
}

// EXPORT
// -----------------------------
module.exports = minifySrc;