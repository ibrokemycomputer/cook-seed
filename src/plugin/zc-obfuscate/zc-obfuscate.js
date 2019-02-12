/**
 * <a>
 * OBFUSCATE EMAIL
 * @description Create email link with Javascript to fool(?) bots
 */
zcObfuscate = window.zcObfuscate || {
  targets: document.querySelectorAll('[obfuscate-name]'),
  index: 0,
  domainAttr: 'obfuscate-domain',
  nameAttr: 'obfuscate-name',
  obfuscateAttr: 'zc-obfuscate'
};
// Add `length` prop only if matching targets found
if (zcObfuscate.targets) zcObfuscate.emailLen = zcObfuscate.targets.length;
// 'Create Link' method
zcObfuscate.createLink = function(target) {
  if (!target.hasAttribute(zcObfuscate.domainAttr)) return;
  if (!target.hasAttribute(zcObfuscate.nameAttr)) return;
  // Build link
  var domain = target.getAttribute(zcObfuscate.domainAttr);
  var name = target.getAttribute(zcObfuscate.nameAttr);
  var address = name + '@' + domain;
  // Create link
  var link = document.createElement('a');
  link.href = 'mailto:' + address;
  link.textContent = address;
  link.setAttribute(zcObfuscate.obfuscateAttr,'');
  // Add Link to DOM
  target.insertAdjacentElement('beforebegin', link);
  // Remove old placeholder element
  target.remove();
}
// Add Links to DOM
zcObfuscate.init = function() {
  // Create link for each instance in the DOM
  for (zcObfuscate.index=0; zcObfuscate.index < zcObfuscate.emailLen; zcObfuscate.index++) {
    zcObfuscate.createLink(zcObfuscate.targets[zcObfuscate.index]);
  }
}
// Init
zcObfuscate.init();