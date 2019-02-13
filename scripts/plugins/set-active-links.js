/**
 * @file set-active-links.js
 * @description Add `[active]` state to `<a>` tags whose `[href]` value matches the current page
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const fs = require('fs-extra');
const utils = require(`${cwd}/scripts/utils/util.js`);
const Logger = require(`${cwd}/scripts/utils/logger.js`);

// Config
const {distPath} = require(`${cwd}/config/main.js`);


// DEFINE
// -----------------------------
async function setActiveLinks({file, allowType, disallowType}) {
  // Early Exit: File type not allowed
  const allowed = utils.isAllowedType({file,allowType,disallowType});
  if (!allowed) return;

  // Make source traversable with JSDOM
  let dom = utils.jsdom.dom({src: file.src});

  // Find <a> tags and add active state 
  // if their [href] matches the current page url
  const $links = dom.window.document.querySelectorAll('a');
  $links.forEach((link,i) => setActive({file, link}));

  // Store updated file source
  file.src = utils.setSrc({dom});
}

// HELPER METHODS
// -----------------------------

function getComparisonPart(path) {
  let splitOnSlash = path.split('/');
  splitOnSlash = splitOnSlash.filter(s => s !== '');
  let lastPart = splitOnSlash[splitOnSlash.length-1];
  let fileName = lastPart.split('.')[0];
  if (fileName === 'index') fileName = splitOnSlash[splitOnSlash.length-2];
  if (fileName === distPath) fileName = '/';
  return fileName;
}

/**
 * @description Set <a> tags to 'active' state if their [href] value file name matches the current file's name
 * @param {Object} opts - The arguments object
 * @property {Object} file - The current file's props (ext,name,path,name)
 * @property {Object} link - The current <a> tag being evaluated
 * @private
 */
function setActive({file, link}) {
  const currPath = getComparisonPart(file.path);
  const linkPath = getComparisonPart(link.href);
  if (linkPath === currPath) link.setAttribute('active','');
}

// EXPORT
// -----------------------------
module.exports = setActiveLinks;