  /**
   * TOOLTIP
   * @description Show tooltip on target hover
   */
  var zcTooltip = {
    $targets: document.querySelectorAll('[zc-tooltip]'),
    $tooltip: null,
    activeAttr: 'active',
    containerAttr: 'zc-tooltip-container',
    containerSelector: '[zc-tooltip-container]',
    delayTO: null,
    limit: 1023,
    triggerAttr: 'zc-tooltip',
    styleAttr: 'style'
  };
  // Add show/hide events
  zcTooltip.initEvents = function() {
    // Create trigger hover event
    var i, target, text, len = zcTooltip.$targets.length;
    for (i=0; i<len; i++) {
      target = zcTooltip.$targets[i];
      // Populate text and show
      target.addEventListener('mouseenter', function(e) { zcTooltip.show(e.target) });
      // Hide
      target.addEventListener('mouseleave', function(e) { zcTooltip.hide() });
    }
  }
  // Add reusable tooltip markup to DOM
  zcTooltip.init = function() {
    var tooltip = document.createElement('div');
    var span = document.createElement('span');
    // Add 2 child <span> for CSS animation
    tooltip.appendChild(span.cloneNode(true));
    tooltip.appendChild(span.cloneNode(true));
    // Add attribute to container for CSS styling
    tooltip.setAttribute(zcTooltip.containerAttr,'');
    // Add container to DOM if one doesn't already exist
    if (!document.querySelector(zcTooltip.containerSelector)) {
      document.body.insertAdjacentHTML('beforeend', '<!-- Tooltip -->');
      document.body.insertAdjacentElement('beforeend', tooltip);
    }
    // Store container now its in the DOM
    zcTooltip.$tooltip = document.querySelector(zcTooltip.containerSelector);

    // Add events if device width large enough
    // NOTE: If loaded in < 1024, no DOM inline-styling occurs and events not bound
    // If loaded > 1024 and then device width changed to below limit, tooltip code runs but hidden via CSS
    var allowed = window.innerWidth > zcTooltip.limit;
    if (allowed) zcTooltip.initEvents();
  }
  // Clear Tooltip
  zcTooltip.clear = function() {
    zcTooltip.$tooltip.removeAttribute(zcTooltip.activeAttr);
    zcTooltip.$tooltip.removeAttribute(zcTooltip.styleAttr);
    clearTimeout(zcTooltip.delayTO);
  }
  // Populate and Show tooltip
  zcTooltip.show = function(target) {
    var pos = target.getBoundingClientRect();
    var text = target.getAttribute(zcTooltip.triggerAttr);
    var winWidth = window.innerWidth;
    // Set text
    zcTooltip.$tooltip.children[1].textContent = text;
    // Clear positioning
    zcTooltip.clear();
    // Set new positioning
    // zcTooltip.$tooltip.style.top = pos.y + pos.height + 'px';
    // zcTooltip.$tooltip.style.top = 'var(--header-height)';
    zcTooltip.$tooltip.style.right = (winWidth - (pos.x + pos.width)) + 'px';
    // Set 
    // Show tooltip (w/ debounced delay)
    zcTooltip.delayTO = setTimeout(() => {
      zcTooltip.$tooltip.setAttribute(zcTooltip.activeAttr,'');        
    }, 300);
  }
  // Hide Tooltip
  zcTooltip.hide = function() {
    zcTooltip.clear();
  }
  // Init
  zcTooltip.init();