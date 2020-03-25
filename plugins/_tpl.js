/**
 * @file _tpl.js
 * @description Starting plugin bootstrap.
 */

// REQUIRE
// -----------------------------
const cwd = process.cwd();
const chalk = require('chalk');
// const fs = require('fs-extra');
// const Logger = require(`${cwd}/node_modules/cook/scripts/utils/logger/logger.js`);
// const Spinner = require(`${cwd}/node_modules/cook/scripts/utils/spinner/spinner.js`);
// const Timer = require(`${cwd}/node_modules/cook/scripts/utils/timer/timer.js`);
const Util = require(`${cwd}/node_modules/cook/scripts/utils/util/util.js`);

// CORE CONFIG
// const {distPath,srcPath} = require(`${cwd}/node_modules/cook/scripts/utils/config/config.js`);
// SITE CONFIG
// const {sitemap} = require(`${cwd}/config/main.js`);


// DEFINE
// -----------------------------
class PluginTemplate {
  
  constructor({file, data}) {
    
    // Store data
    this.file = file; // Note: If running as a 'Before' or 'After' hook, 'file' will not be available
    this.data = data;
  }

  // INIT
  // -----------------------------

  // Your plugin must have an `init()` method. This is what the build looks for.
  // It can be synchronous (`init()`) or async (`async init()`)
  async init() {

    /*
      UPDATING FILES IN THE FILE LOOP
      This sequence only viable if plugin runs in the `default` plugin location in `/config/main.js`
      If running in the `before` or `after` config arrays, you will only have access to your `this.data` object in `/config/data.js`
    */

    // Early Exit: Only check in .html files
    if (this.file.ext !== 'html') return;

    // CONVERT TO DOM
    // Convert page src to traversable DOM
    let dom = Util.jsdom.dom({src: this.file.src});  

    // QUERY TARGET ELEMENT(S)
    // Test querying the DOM
    const h1 = dom.window.document.querySelectorAll('h1');

    // Early Exit: No h1 tags
    if (!h1 || !h1.length) return;

    // DO STUFF...
    h1.forEach(header => this.addSmiley(header));

    // You can also do async things if you make `init()` async
    // const foo = await this.someAsync();
    // --
    // const raw = await fetch(...).catch(err => console.log(err));
    // const json = await raw.json();
    

    // CONVERT DOM BACK TO STRING
    // Store updated file source
    const updatedSrc = Util.setSrc({dom});

    // ADD UPDATED SOURCE FOR NEXT PLUGIN
    // Update the passable-object's source with the changes
    // This way the next plugin uses the updates and not the original
    this.file.src = updatedSrc;
  }


  // HELPER METHODS
  // -----------------------------

  addSmiley(el) {
    if (el) el.innerHTML += ':)';
  }

  // async someAsync() {}

}


// EXPORT
// -----------------------------
module.exports = {PluginTemplate};