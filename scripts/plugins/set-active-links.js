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
async function setActiveLinks({$, fileName}) {
  const $links = $('a');
  $links.each((i,link) => setActive({$, fileName, link}));
}

// HELPER METHODS
// -----------------------------

function setActive({$, fileName, link}) {
  let file = fileName.split('/');
  file = file[file.length-1].split('.')[0];
  let href = link.attribs.href.split('/');
  href = href[href.length-1].split('.')[0];
  if (href === file) $(link).attr('active','');
}

// EXPORT
// -----------------------------
module.exports = setActiveLinks;