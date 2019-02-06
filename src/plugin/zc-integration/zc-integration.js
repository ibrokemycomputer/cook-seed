/* <div zc-integration="controls">
  <input type="radio" name="wrapper" value="js-tab">
  <label for="js"><span zc-integration="icon"></span>JavaScript</label>
  
  <input type="radio" name="wrapper" value="angularjs-tab">
  <label for="angularjs"><span zc-integration="icon"></span>AngularJS</label>

  <input type="radio" name="wrapper" value="react-tab">
  <label for="react"><span zc-integration="icon"></span>React</label>
  
  <input type="radio" name="wrapper" value="php-tab">
  <label for="php"><span zc-integration="icon"></span>PHP</label>
  
  <input type="radio" name="wrapper" value="jquery-tab">
  <label for="jquery"><span zc-integration="icon"></span>jQuery</label>
  
  <input type="radio" name="wrapper" value="ember-tab">
  <label for="ember"><span zc-integration="icon"></span>Ember</label>
  
  <input type="radio" name="wrapper" value="backbone-tab">
  <label for="backbone"><span zc-integration="icon"></span>Backbone</label>
</div> */

/**
 * INTEGRATION TAB SWITCHER
 * @description Create tab controls to switch between integration demos
 */
zcIntegration = window.zcIntegration || {
  $ref: document.querySelector('[jsref="zc-integration-container"]'),
  activeAttr: 'active',
  integrationAttr: 'zc-integration',
  SPAN: document.createElement('span')
};
// Store integration panels to make tabs from
zcIntegration.$refPanels = zcIntegration.$ref.querySelectorAll('[jsref~="integration-panel"]'),
zcIntegration.$tabBox = zcIntegration.$ref.querySelector('[jsref~="zc-integration-controls"]'),
// Create and append the tabs
zcIntegration.createControls = function() {
  zcIntegration.$refPanels.forEach((panel,index) => {
    zcIntegration.tab = panel.querySelector('[zc-integration="tab"]').cloneNode(true);
    // Add Click Event
    zcIntegration.tab.addEventListener('click', function(e) {
      zcIntegration.tabs = zcIntegration.$tabBox.children;
      if (!zcIntegration.tabs) return;
      // Unset previous active tab
      [...zcIntegration.tabs].forEach(tab => tab.removeAttribute(zcIntegration.activeAttr));
      // Set current tab to 'active'
      zcIntegration.$tabBox.children[index].setAttribute(zcIntegration.activeAttr,'');
      // Unset previous active panel
      zcIntegration.$refPanels.forEach(panel => panel.removeAttribute(zcIntegration.activeAttr));
      // Set current tab to 'active'
      panel.setAttribute(zcIntegration.activeAttr,'');
    });
    // Append tab to DOM
    zcIntegration.$tabBox.appendChild(zcIntegration.tab);

  });
};
// Show starting integration on load
zcIntegration.initStartingIntegration = function() {
  // Set first tab to active on load
  zcIntegration.$tabBox.children[0].setAttribute(zcIntegration.activeAttr,'');
  // Show first panel on load
  zcIntegration.$refPanels[0].setAttribute(zcIntegration.activeAttr,'');
};
// Consolidate processes into init method
zcIntegration.init = function() {
  zcIntegration.createControls();
  zcIntegration.initStartingIntegration();
}
// Init
zcIntegration.init();