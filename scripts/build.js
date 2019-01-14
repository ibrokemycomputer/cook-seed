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
const replaceIncludes = require('./plugins/replace-includes.js');
const replaceInline = require('./plugins/replace-inline.js');
const replaceSrcPathForDev = require('./plugins/replace-src-path.js');
const setActiveLinks = require('./plugins/set-active-links.js');

// GET SOURCE
const {getSrcConfig,getSrcFiles} = require('./plugins/get-src');

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
  await getSrcFiles(async files => {
    // Run tasks on matched files
    await files.forEach(async fileName => {
      // Store file meta for use in plugins (file source, extension, cheerio dom object, etc.)
      const {$,fileExt,fileSource} = await getSrcConfig({fileName});
      
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
      fs.writeFileSync(fileName, utils.getSrc({$, fileExt}));
    });
  });

  // 4. Minify Source
  await minifySrc();
};
build();