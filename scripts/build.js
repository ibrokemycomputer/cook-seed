// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
const cheerio = require('cheerio');
const fs = require('fs');
const utils = require(`${cwd}/scripts/utils/util.js`);

// PLUGINS
// -----------------------------
const copySrc = require('./plugins/copy-src');
const createDist = require('./plugins/create-dist');
const minifySrc = require('./plugins/minify-src');
const replace = require('./plugins/replace');
const replaceIncludes = require('./plugins/replace-includes.js');
const replaceInline = require('./plugins/replace-inline.js');
const replaceSrcPathForDev = require('./plugins/replace-src-path.js');
const setActiveLinks = require('./plugins/set-active-links.js');

// BUILD
// -----------------------------
async function build() {
  // Show init message
  console.log(`${ chalk.blue('\n[Build]') } ${ chalk.blue.bold('`npm run build`') }`);

  // 1. Create `/dist` if not already made
  await createDist();

  // 2. Copy `/src` to `/dist`
  await copySrc();

  // 3. Replace source-file content
  await replace(async files => {
    // Run tasks on matched files
    await files.forEach(fileName => {
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
    });
  });

  // 4. Minify Source
  await minifySrc();
};
build();