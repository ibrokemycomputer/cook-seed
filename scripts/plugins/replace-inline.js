/**
 * @file replace-inline.js
 * @description Replace external `<link>` and `<script>` calls inline
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
async function replaceInline({$, fileExt, fileName, allowType, disallowType}) {
  // Early Exit: File type not allowed
  const allowed = utils.isAllowedType({fileExt,allowType,disallowType});
  if (!allowed) return;

  // Early Exit: Do not replace files locally
  if (process.env.NODE_ENV === 'development') return;

  // REPLACE INLINE CSS
  replaceLink($(`link[${utils.attr.inline}]`), $, fileName);
  // REPLACE INLINE SCRIPT
  replaceScript($(`script[${utils.attr.inline}]`), $, fileName);
}


// HELPER METHODS
// -----------------------------

function replaceLink(group, $, fileName) {
  let href, replacePath, replaceSrc;
  group.each((i,el) => {
    // The 'inner' content of the `<style>` tag
    href = $(el).attr('href');
    // Early Exit: Not a relative path to CSS file, likely external
    if (href.charAt(0) !== '/') return;
    replacePath = `${distPath}${href}`;
    replaceSrc = fs.readFileSync(replacePath, 'utf-8');
    // Add new `<style>` tag and then delete `<link>`
    $(el).before(`<style>${replaceSrc}</style>`);
    $(el).remove();
    // Show terminal message
    Logger.success(`${fileName} - Replaced link[${utils.attr.inline}]: ${ chalk.green(href) }`);
  });
}

function replaceScript(group, $, fileName) {
  let replacePath, replaceSrc;
  group.each((i,el) => {
    // The 'inner' content of the `<style>` tag
    replacePath = `${distPath}/${ $(el).attr('src') }`;
    replaceSrc = fs.readFileSync(replacePath, 'utf-8');
    // Add new `<script>` tag and then delete old external `<script>`
    $(el).before(`<script>${replaceSrc}</script>`);
    $(el).remove();
    // Show terminal message
    Logger.success(`${fileName} - Replaced script[${utils.attr.inline}]: ${ chalk.green($(el).attr('src')) }`);
  });
}

// EXPORT
// -----------------------------
module.exports = replaceInline;