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
const createDirFromFile = require('./plugins/create-dir-from-file');
const minifySrc = require('./plugins/minify-src');
const replaceIncludes = require('./plugins/replace-includes.js');
const replaceInline = require('./plugins/replace-inline.js');
const replaceSrcPathForDev = require('./plugins/replace-src-path.js');
const setActiveLinks = require('./plugins/set-active-links.js');

// CONFIG
const {convertPageToDirectory} = require(`${cwd}/config/main.js`);

// GET SOURCE
const {getSrcConfig,getSrcFiles,rebindCheerio} = require('./utils/get-src');

// BUILD
// -----------------------------
async function build() {
  // Show init message
  console.log(`${ chalk.blue('\n[Build]') } ${ chalk.blue.bold('`npm run build`') }`);

  // PLUGIN: Create `/dist` if not already made
  await createDist();

  // PLUGIN: Copy `/src` to `/dist`
  await copySrc();
  
  // Get valid project files to manipulate (this method makes it so we only need to read/write the file once)
  await getSrcFiles(async files => {
    // Run tasks on matched files
    await files.forEach(async fileName => {
      
      // Open file and store file info for use in plugins (file source, extension, cheerio dom object, etc.)
      let {$,fileExt,fileSource} = await getSrcConfig({fileName});

      if (fileName === 'dist/plugin/zc-obfuscate/zc-obfuscate.js') {
        console.log('hi', $('body').html())
      }
      
      // PLUGIN: Replace all `[include]` in file
      replaceIncludes({$, fileExt, fileName, allowType: ['.html']});
      
      // PLUGIN: Inline all external `<link>` and `<script>` tags with `[inline]`
      replaceInline({$, fileExt, fileName, allowType: ['.html']});
      // PLUGIN: `/src` is needed for `@import url()` calls when inlining source
      // Since we don't inline in 'development' mode, we need to remove `/src` paths
      // since `/src` doesn't exist in `/dist`
      replaceSrcPathForDev({$, fileExt, fileName, allowType: ['.css']});

      // PLUGIN: Find `<a>` tags whose [href] value matches the current page (link active state)
      setActiveLinks({$, fileExt, fileName, allowType: ['.html']});

      // PLUGIN: Minify Source
      const minifiedSrc = minifySrc({$, fileExt, fileName});
      // Need to replace the Cheerio var with the new minfied source
      if (minifiedSrc) $ = await rebindCheerio({fileName, src: minifiedSrc});

      // utils.testSrc({fileName, src: utils.getSrc({$, fileExt})});

      // PLUGIN: Create directory from .html file
      if (convertPageToDirectory) createDirFromFile({$, fileExt, fileName, allowType: ['.html'], excludePath: ['dist/index']});
      
      // Write new, modified code back to the file
      fs.writeFileSync(fileName, utils.getSrc({$, fileExt}));
    });
  });
};
build();