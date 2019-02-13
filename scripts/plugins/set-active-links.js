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

/**
 * @description Set <a> tags to 'active' state if their [href] value file name matches the current file's name
 * @param {Object} opts - The arguments object
 * @property {Object} file - The current file's props (ext,name,path,name)
 * @property {Object} link - The current <a> tag being evaluated
 * @private
 */
function setActive({file, link}) {
  // Current page file name
  let matchPath = file.path.split('/');
  matchPath = matchPath[matchPath.length-1].split('.')[0];
  // Current <a> tag link's [href] path file name
  let href = link.href.split(`${utils.jsdom.baseUrl}/`);
  href = href[href.length-1].split('.')[0];
  // If they match, set the <a> to its active state
  if (href === matchPath) link.setAttribute('active','');
}

// EXPORT
// -----------------------------
module.exports = setActiveLinks;