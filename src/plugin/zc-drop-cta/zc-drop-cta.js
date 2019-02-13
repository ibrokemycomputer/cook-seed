/**
 * ZINGGRID DROP CTA
 * @description Show dismissable x-promotion with ZingGrid
 */
var zcDropCTA = {
  $source: document.querySelector('[jsref="zc-drop-cta"]'),
  $appendTarget: document.querySelector('header'),
  hiddenAttr: 'hidden',
  closeSelector: '[jsref="zc-drop-cta-close"]',
  instanceId: 'zinggrid-cta-1',
  init: function() {
    const optOut = zcDropCTA.isOptOut();
    if (optOut) return;
    zcDropCTA.addToDOM();
    zcDropCTA.attachEvents();
  },
  addToDOM: function() {
    const {instanceId,$source,$appendTarget} = zcDropCTA;
    const cloneFrag = document.importNode($source.content, true);
    const clone = cloneFrag.children[0];
    clone.id = instanceId;
    $appendTarget.insertAdjacentElement('afterend', clone);
  },
  attachEvents: function() {
    const {localStorage} = window;
    const {closeSelector,hiddenAttr,instanceId,localStorageKey} = zcDropCTA;
    const cta = document.querySelector(`#${instanceId}`);
    const close = cta.querySelector(closeSelector);
    close.addEventListener('click', e => {
      // Hide element in DOM
      cta.setAttribute(hiddenAttr,'');
      // Add localStorage var to not show on repeat visits
      localStorage.setItem(localStorageKey,true);
    });
    // Add [run] to start CSS animation
    setTimeout(() => cta.setAttribute('run',''), 1000);
  },
  isOptOut: function() {
    const {localStorage} = window;
    const {localStorageKey} = zcDropCTA;
    const getLocalStorage = localStorage.getItem(localStorageKey);
    return getLocalStorage !== null;
  },
};
// StorageKey
zcDropCTA.localStorageKey = `${zcDropCTA.instanceId}-dismiss`;
// Init
zcDropCTA.init();