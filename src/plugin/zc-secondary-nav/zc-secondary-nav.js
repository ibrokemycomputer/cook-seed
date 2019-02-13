/**
 * SECONDARY NAV
 * @description Copy secondary nav items (<a>) to designated area in primary nav (for mobile ui)
 */
var zcSecondaryNav = {
  $items: document.querySelectorAll('[nav-secondary] a'),
  $target: document.querySelector('[nav-primary-group="2"]'),
  init: function() {
    var i, clone, items = zcSecondaryNav.$items;
    for (i = 0; i<items.length; i++) {
      clone = items[i].cloneNode(true);
      zcSecondaryNav.$target.appendChild(clone);
    }
  }
};
// Init
zcSecondaryNav.init();