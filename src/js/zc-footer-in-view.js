/**
 * FOOTER INTERSECTION OBSERVER
 * @description Add 'html-footer-in-view' to <html> to assist with the gallery/docs pages' sidebar positioning
 */
zcFooterInView = window.zcFooterInView || {
  inViewAttr: 'html-footer-in-view',
  $html: document.documentElement
}
// Define `init` method to instantiate intersectionObserver
zcFooterInView.init = function() {
  var intersectionObserver = new IntersectionObserver(function(entries) {
    // If intersectionRatio is 0, the target is out of view
    // and we do not need to do anything.
    if (entries[0].intersectionRatio <= 0) zcFooterInView.$html.removeAttribute(zcFooterInView.inViewAttr);
    else zcFooterInView.$html.setAttribute(zcFooterInView.inViewAttr,'');
  });
  // start observing
  intersectionObserver.observe(document.querySelector('footer'));
};
// Init IO
zcFooterInView.init();