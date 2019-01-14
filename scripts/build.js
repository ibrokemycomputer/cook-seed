// REQUIRE
// -----------------------------
const chalk = require('chalk');
const fs = require('fs');

// PLUGINS
// -----------------------------
const copySrc = require('./plugins/copy-src');
const createDist = require('./plugins/create-dist');
const minifySrc = require('./plugins/minify-src');
const replace = require('./plugins/replace');

// BUILD
// -----------------------------
async function build() {
  // Show init message
  console.log(`${ chalk.blue('\n[Build]') } ${ chalk.blue.bold('`npm run build`') }`);

  // 1. Create `/dist` if not already made
  await createDist();

  // 2. Copy `/src` to `/dist`
  await copySrc();

  // 4. Replace [include] and [inline] elements with target source inline
  await replace();

  // 3. Minify Source
  await minifySrc();
};
build();