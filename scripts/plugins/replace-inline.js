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
async function replaceInline({file, allowType, disallowType}) {
  // Early Exit: File type not allowed
  const allowed = utils.isAllowedType({file,allowType,disallowType});
  if (!allowed) return;

  // Early Exit: Do not replace files locally
  if (process.env.NODE_ENV === 'development') return;

  // Make source traversable with JSDOM
  let dom = utils.jsdom.dom({src: file.src});

  // Store all <link inline> and <scripts inline>
  const links = dom.window.document.querySelectorAll(`link[${utils.attr.inline}]`);
  const scripts = dom.window.document.querySelectorAll(`script[${utils.attr.inline}]`);

  // REPLACE INLINE CSS
  replaceLink({links, file});
  // REPLACE INLINE SCRIPT
  replaceScript({scripts, file});

  // Store updated file source
  file.src = utils.setSrc({dom});
}


// HELPER METHODS
// -----------------------------

function replaceLink({links, file}) {
  let href, replacePath, replaceSrc;
  links.forEach((el,i) => {
    // The 'inner' content of the `<style>` tag
    href = el.getAttribute('href');
    // Early Exit: Not a relative path to CSS file, likely external
    if (href.charAt(0) !== '/') return;
    replacePath = `${distPath}${href}`;
    replaceSrc = fs.readFileSync(replacePath, 'utf-8');
    // Add new `<style>` tag and then delete `<link>`
    el.insertAdjacentHTML('beforebegin', `<style>${replaceSrc}</style>`);
    el.remove();
    // Show terminal message
    Logger.success(`${file.path} - Replaced link[${utils.attr.inline}]: ${ chalk.green(href) }`);
  });
}

function replaceScript({scripts, file}) {
  let replacePath, replaceSrc;
  scripts.forEach((el,i) => {
    // The 'inner' content of the `<style>` tag
    replacePath = `${distPath}/${ el.getAttribute('src') }`;
    replaceSrc = fs.readFileSync(replacePath, 'utf-8');
    // Add new `<script>` tag and then delete old external `<script>`
    el.insertAdjacentHTML('beforebegin', `<script>${replaceSrc}</script>`);
    el.remove();
    // Show terminal message
    Logger.success(`${file.path} - Replaced script[${utils.attr.inline}]: ${ chalk.green(el.getAttribute('src')) }`);
  });
}

// EXPORT
// -----------------------------
module.exports = replaceInline;