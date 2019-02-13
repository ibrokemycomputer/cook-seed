/**
 * NAV DROPDOWNS
 * @description Mobile Nav Trigger and Mask actions
 */
var zcNav = {
  activeAttr: 'html-nav-active',
  resizeTO: null,
  resizeMatch: null,
  triggerIndex: null,
  triggerLen: null,
  $html: document.documentElement,
  $trigger: null,
  $triggers: document.querySelectorAll('[nav-trigger]'),
  $mask: document.querySelector('[jsref="nav-mask"]')
};
// Mask click to close
zcNav.maskClick = function(e) {
  zcNav.$html.removeAttribute(zcNav.activeAttr);
};
// Window resize
zcNav.resize = function(e) {
  // Debounce code
  clearTimeout(zcNav.resizeTO);
  zcNav.resizeTO = setTimeout(function() {
    zcNav.resizeMatch = window.innerWidth > 1023 && zcNav.$html.hasAttribute(zcNav.activeAttr);
    // Remove attribute only if present
    if (zcNav.resizeMatch) zcNav.$html.removeAttribute(zcNav.activeAttr);
  }, 500);
};
// Mobile trigger button click
zcNav.triggerClick = function(target) {
  var type = target.getAttribute('nav-trigger');
  if (zcNav.$html.hasAttribute(zcNav.activeAttr)) zcNav.$html.removeAttribute(zcNav.activeAttr);
  else zcNav.$html.setAttribute(zcNav.activeAttr, type);
};
// Add init items
zcNav.init = function() {
  // Toggle <body> class to show/hide dropdown in mobile
  zcNav.triggerLen = zcNav.$triggers.length;
  for (zcNav.triggerIndex = 0; zcNav.triggerIndex<zcNav.triggerLen; zcNav.triggerIndex++) {
    zcNav.$trigger = zcNav.$triggers[zcNav.triggerIndex];
    zcNav.$trigger.addEventListener('click', function(e) { zcNav.triggerClick(zcNav.$trigger) });
  }
  // Close nav on mask click
  zcNav.$mask.addEventListener('click', zcNav.maskClick);
  // Remove <body> attribute when not in mobile
  window.addEventListener('resize', zcNav.resize, {passive:true});
}
// Init
zcNav.init();