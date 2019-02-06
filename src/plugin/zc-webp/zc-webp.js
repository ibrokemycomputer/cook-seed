/**
 * TEST WEBP SUPPORT
 * @description Add CSS class to <html> if webp supported or not
 */
zcWebp = window.zcWebp || {
  webpClass: 'webp',
  noWebpClass: 'no-webp',
  testWebP: function(target) {
    test(notify);
    function test(callback) {
      // Create tiny .webp image to test for
      const webp = new Image();
      webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      // webp.onload = webp.onerror = () => callback(webp.height === 2);
      webp.onload = webp.onerror = function() {
        callback(webp.height === 2);
      }
    }
    function notify(supported) {
      // Add css class to <body>
      const web_css_class = supported ? zcWebp.webpClass : zcWebp.noWebpClass;
      target.classList.add(web_css_class);
    }
  },
  init: function() {
    zcWebp.testWebP(document.documentElement);
  }
};
// Init
zcWebp.init();