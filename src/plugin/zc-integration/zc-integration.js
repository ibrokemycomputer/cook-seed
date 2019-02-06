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
    zcIntegration.tab = panel.cloneNode(true);
    // Add Click Event
    console.log('zcIntegration.tab', zcIntegration.tab)
    zcIntegration.tab.addEventListener('click', function(e) {
      // Unset previous active tab
      zcIntegration.$tabBox.forEach(tab => tab.removeAttribute(zcIntegration.activeAttr));
      this.setAttribute(zcIntegration.activeAttr,'');
    });
    // Append tab to DOM
    zcIntegration.$tabBox.appendChild(zcIntegration.tab);

  });
},
// Consolidate processes into init method
zcIntegration.init = function() {
  zcIntegration.createControls();
}
// Init
zcIntegration.init();