/**
 * DEMO SCROLL
 * @description Create scrollable demos carousel
 * See: Homepage instance
 */
zcDemoScroll = window.zcDemoScroll || {
  readyAttr: 'ready',
  scrollEl: '[jsref="demo-scroll"]',
  leftSelector: 'demo-scroll-left',
  rightSelector: 'demo-scroll-right',
  scrollWrapper: document.querySelector('[jsref="demo-scroll-wrapper"]'),
  scrollTimer: null,
  scroll: function() {
    var factor = 1;
    var isScroll = this.getAttribute('jsref');
    if (isScroll === zcDemoScroll.leftSelector) factor = -1;
    zcDemoScroll.scrollTimer = setInterval(function () {                           
      zcDemoScroll.scrollWrapper.scrollLeft += (10 * factor);
    }, 15);
  },
  stopScroll: function() {
    if (zcDemoScroll.scrollTimer) clearInterval(zcDemoScroll.scrollTimer);
  },
  init: function() {
    zcDemoScroll.left.addEventListener('mousedown', zcDemoScroll.scroll);
    document.addEventListener('mouseup', zcDemoScroll.stopScroll);
    zcDemoScroll.right.addEventListener('mousedown', zcDemoScroll.scroll);
    document.addEventListener('mouseup', zcDemoScroll.stopScroll); 
  }
};
zcDemoScroll.left = document.querySelector('[jsref="' + zcDemoScroll.leftSelector + '"]'),
zcDemoScroll.right = document.querySelector('[jsref="' + zcDemoScroll.rightSelector + '"]'),
// Init
zcDemoScroll.init();