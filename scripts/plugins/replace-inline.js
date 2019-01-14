/**
 * @file replace-inline.js
 * @description Replace external `<style>` and `<script>` calls inline
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
async function replaceInline({$, fileName}) {
  // Early Exit: Do not replace files
  if (process.env.NODE_ENV === 'development') return;

  // REPLACE INLINE CSS
  replaceLink($(`link[${utils.attr.inline}]`), $, fileName);
  // REPLACE INLINE SCRIPT
  replaceScript($(`script[${utils.attr.inline}]`), $, fileName);
}


// HELPER METHODS
// -----------------------------

function replaceLink(group, $, fileName) {
  let replacePath, replaceSrc;
  group.each((i,el) => {
    // The 'inner' content of the `<style>` tag
    replacePath = `${distPath}/${ $(el).attr('href') }`;
    replaceSrc = fs.readFileSync(replacePath, 'utf-8');
    // Add new `<style>` tag and then delete `<link>`
    $(el).before(`<style ${utils.attr.inline}>${replaceSrc}</style>`);
    $(el).remove();
    // Show terminal message
    Logger.success(`${fileName} - Replaced link[${utils.attr.inline}]: ${ chalk.green($(el).attr('href')) }`);
  });
}

function replaceScript(group, $, fileName) {
  let replacePath, replaceSrc;
  group.each((i,el) => {
    // The 'inner' content of the `<style>` tag
    replacePath = `${distPath}/${ $(el).attr('src') }`;
    replaceSrc = fs.readFileSync(replacePath, 'utf-8');
    // Add new `<style>` tag and then delete `<link>`
    $(el).before(`<script ${utils.attr.inline}>${replaceSrc}</script>`);
    $(el).remove();
    // Show terminal message
    Logger.success(`${fileName} - Replaced script[${utils.attr.inline}]: ${ chalk.green($(el).attr('src')) }`);
  });
}

// EXPORT
// -----------------------------
module.exports = replaceInline;