/**
 * SCRIPT LOADER UTIL
 * @description Check to see if target element exists in the page before loading targeted scripts
 */
window.pfScript = window.pfScript || {
  prefix: 'pf',
  SCRIPT: document.createElement('SCRIPT'),
};
/**
 * @description Init target script
 * @param {String} selector - The target elements selector to query select for viability
 * @param {Array} scriptPaths - The scripts to run if the target elements found
 * @param {Object} opts - Options object
 * @property {Boolean} [defer] - Adds `[defer]` attribute to script
 * @property {Boolean} [module] - Adds `[type="module"]` attribute to script
 * @property {Boolean} [nomodule] - Adds `[nomodule]` attribute to script
 */
pfScript.init = function(selector, scriptPath, opts) {
  // Curr `<script>` element
  var currScript = document.currentScript;
  // Get target element to see if we should proceed
  var targetEl = null;
  // ID lookup (fastest)
  if (selector && selector.charAt(0) === '#') targetEl = document.getElementById(selector);
  else targetEl = document.querySelector(selector);
  // Early Exit: Target(s) not found, do not load script
  // Note: Manually passing in `null` allows you to bypass and load scripts like vendor scripts w/o a target element needing to be present
  if ((!opts || !opts.defer) && selector !== null && !targetEl) return;
  // Early Exit: Given paths are not in an array
  if (typeof scriptPath !== 'object' || !scriptPath.length) return;
  // Valid. Load each script
  scriptPath.forEach(function(path) {
    // Clone a new script instance
    var script = pfScript.SCRIPT.cloneNode(true);
    // Set attributes
    script.src = path;
    if (opts && opts.defer) script.defer = true;
    if (opts && opts.module) script.type = 'module';
    if (opts && opts.nomodule) script.setAttribute('nomodule','');
    // Add 'loaded' event
    script.addEventListener('load', function() {
      var fileNameSplit = path.split('/');
      var fileNameFull = fileNameSplit[fileNameSplit.length - 1];
      var fileNameFullSplit = fileNameFull.split('.js');
      var fileName = fileNameFullSplit[0];
      var eventName = pfScript.prefix + '-script-loaded-' + fileName.replace(/\./g, '-');
      // CUSTOM EVENT
      // Fire custom 'loaded' event
      var event = new CustomEvent(eventName, {
        detail: {
          path: path
        }
      });
      document.dispatchEvent(event);
    });
    // Insert script before placeholder script
    currScript.parentNode.insertBefore(script, currScript);
  });
  // Remove old placeholder script
  currScript.remove();
};