/**
 * Created by prodee on 7/12/16.
 */

var Lesson = function (options) {
  this.codeID = options.codeID;
  this.chartID = options.chartID;
  this.chart = options.chart;
  this.fields = options.fields;
  this.chartHeight = options.chartHeight;

  this.codeElement = document.getElementById(this.codeID);

  // This is the ratio between width and height of the standard web monospace font
  this.MONOSPACE_HEIGHT = 13;
  this.MONOSPACE_RATIO = 1.6655100625;
  this.NBSP_SIZE = 8.39;
};

/**
 * Renders the input fields, attaches the listeners, and renders the chart
 */
Lesson.prototype.render = function () {
  var _this = this;

  var editorJSON = JSON.stringify(_this.chart, null, '  ');

  // Make the arrays look pretty
  editorJSON = editorJSON.replace(/\[\s+([0-9]+)/g, '[$1').replace(/([0-9]+,)\s+(?=[0-9])/g, '$1').replace(/([0-9]+)\s+\]/g, '$1]');

  var renderJSON = JSON.stringify(_this.chart);

  Object.keys(_this.fields).forEach(function (fieldName) {

    // Get the parent HTML for this editor
    var wrappedHTML = _this.createFieldWrapper(fieldName);

    // Get the input field for this editor
    var inputField = _this.createField(fieldName);

    // Append the input field to the parent element
    wrappedHTML.appendChild(inputField);

    if (inputField.type === 'checkbox') {
      editorJSON = editorJSON.replace('"' + fieldName + '"', wrappedHTML.outerHTML);
    } else {
      editorJSON = editorJSON.replace(fieldName, wrappedHTML.outerHTML);
    }
    renderJSON = renderJSON.replace(fieldName, _this.fields[fieldName].default);
  });

  renderJSON = JSON.parse(renderJSON);
  
  // Set the internal renderable JSON
  _this.renderableChartJSON = renderJSON;

  // Set the code el's innerHTML
  _this.codeElement.innerHTML = editorJSON;

  // Set each field's input value
  var fields = document.querySelectorAll('.chart-editor__input');
  for (var i = 0; i < fields.length; i++) {
    if (fields[i].getAttribute('data-value')) {
      fields[i].value = fields[i].getAttribute('data-value');
    }

    if (fields[i].getAttribute('data-value')) {
      fields[i].checked = fields[i].getAttribute('data-value') === 'true';
    }
  }

  // Add all event listeners in one fell swoop
  _this.addListeners();

  // Finally, render the chart!
  zingchart.render({
    id: _this.chartID,
    data: renderJSON,
    height: _this.chartHeight || 400
  });
};

Lesson.prototype.destroy = function () {
  var _this = this;

  // Destroy chart
  zingchart.exec(_this.chartID, 'destroy');

  // Remove the pre field
  _this.codeElement.innerHTML = '';
};

Lesson.prototype.parseUpdatedJSON = function () {
  var _this = this;
  var chartJSON = JSON.stringify(_this.chart);

  Object.keys(_this.fields).forEach(function (fieldName) {
    var field = document.querySelector('[name="' + fieldName + '"]');
    if (field) {
      if (field.type && field.type === 'checkbox') {
        chartJSON = chartJSON.replace('"' + fieldName + '"', field.checked);
      } else {
        if (field.value) {
          chartJSON = chartJSON.replace(fieldName, field.value);
        } else {
          chartJSON = chartJSON.replace(fieldName, '');
        }
      }
    }
  });
    
  // Update the renderable JSON
  _this.renderableChartJSON = JSON.parse(chartJSON);

  return _this.renderableChartJSON;
};

/**
 * Create an input or select field based on the supplied values
 * @param fieldName
 * @returns {Element}
 */
Lesson.prototype.createField = function (fieldName) {
  var _this = this;
  var field = _this.fields[fieldName];
  var input;

  if (field.input === 'select') {
    input = document.createElement(field.input);
  } else {
    input = document.createElement('input');
    input.type = field.input;
  }

  // This is the CSS selector for the input field
  input.className = 'chart-editor__input';

  // Set the name to the field name
  input.name = fieldName;

  if (field.input === 'select') {
    if (field.values && field.values.length > 0) {

      // Iterate over the values and create options from them
      field.values.forEach(function (value) {

        // Create the options element
        var opt = document.createElement('option');
        opt.value = value;
        opt.innerHTML = value;

        // Set field to the default value if it exists
        if (field.default && field.default === value) {
          opt.setAttribute('selected', 'true');
        }

        // Append the option to the select field
        input.appendChild(opt);
      });
    } else {
      // If no values are specified in the field, that's bad
      console.warn('No values specified for select field', field);
    }
  } else {
    /**
     * Ideally, we'd set the value of the input field here.
     * However, when getting the outerHTML of an element,
     * we can't get the value. We get around that by setting
     * a data-value attribute to what we want then referencing
     * that when needed. This only applies for the initial
     * render. Once any input is rendered and a value has been
     * entered, we can just use that value.
     */
    input.setAttribute('data-value', field.default);

    if (field.input === 'checkbox' && field.default === true) {
      input.setAttribute('data-checked', true);
    }

    if (field.max !== null && field.max !== undefined) {
      if (field.input === 'range') {
        input.max = field.max;
      } else if (field.input === 'text') {
        input.maxLength = field.max;
      }
    }

    if (field.min !== null && field.min !== undefined) {
      if (field.input === 'range') {
        input.min = field.min;
      }
    }
  }

  // Return the input that we've created
  return input;
};

/**
 * Creates the field wrapper for an editable field
 * @param fieldName
 * @returns {Element}
 */
Lesson.prototype.createFieldWrapper = function (fieldName) {
  // Create a local reference to the instance of Step
  var _this = this;

  // Get the field from the given name
  var field = _this.fields[fieldName];
  var wrapper = document.createElement('span');
  wrapper.className = 'chart-editor';

  // Create the content element
  var content = document.createElement('span');
  content.className = 'chart-editor__content';
  content.innerHTML = field.default !== null && field.default !== undefined ? field.default : 'DEFAULT MISSING';

  // Append the content element to the wrapper
  wrapper.appendChild(content);

  if (_this.fields[fieldName].tooltip === true) {
    var tooltip = document.createElement('span');
    tooltip.className = 'chart-editor__tooltip';
    wrapper.appendChild(tooltip);
  }

  // Return the wrapper
  return wrapper;
};

/**
 * Creates and adds all the appropriate event listeners
 */
Lesson.prototype.addListeners = function () {
  // Create a local reference to the instance of Step
  var _this = this;

  // Gather all ye chart editor field containers
  var fieldContainers = document.querySelectorAll('.chart-editor');

  // Give an element focus and activate it
  var onClick = function () {
    this.classList.add('active');
    this.querySelector('.chart-editor__input').focus();
  };

  // Load the default value if the field has no value of it's length is 0
  var onFocus = function () {
    // Select the text
    if (this.type && this.type == 'text' || this.type == 'number') {
      this.select();
    }
    
    // Listen for a body mouseup to substitute for a blur
    document.documentElement.addEventListener('mouseup', onBodyMouseUp);
  };

  // Fire on field input event
  var onInput = function () {
    // Update the parent content
    if (this.type === 'checkbox') {
      this.parentNode.querySelector('.chart-editor__content').innerHTML = this.checked;
    } else {
      this.parentNode.querySelector('.chart-editor__content').innerHTML = this.value;
    }

    // Update the tooltip if present
    var tooltip = this.parentNode.querySelector('.chart-editor__tooltip');
    if (tooltip) {
      tooltip.textContent = this.value;
      tooltip.style.right = ((tooltip.getBoundingClientRect().width * -1) - 20) + 'px';
    }

    // Update the chart!
    zingchart.exec(_this.chartID, 'setdata', {
      data: _this.parseUpdatedJSON()
    });
      
    if (_paq) {
        _paq.push(['trackEvent', 'homepage', 'guided editor', this.name, this.value]);
    }
  };

  // Change the input on body mouseup
  var onBodyMouseUp = function (event) {
    if (event.target && !event.target.classList.contains('chart-editor__input') && event.target.tagName !== 'OPTION') {
      var activeArea = document.querySelector('.chart-editor.active');
      if (activeArea) {
        activeArea.classList.remove('active');
      }

      document.documentElement.removeEventListener('mouseup', onBodyMouseUp);
    }
  };

  // Set the input field width
  var setInputWidth = function () {
    if (!this.value || this.value && this.value.length === 0) {
      this.style.width = _this.NBSP_SIZE + 'px';
      this.parentNode.querySelector('.chart-editor__content').innerHTML = '&nbsp;';
    } else {
      // Update the element width
      var width = this.value.length * (_this.MONOSPACE_HEIGHT / _this.MONOSPACE_RATIO) + 1;
      this.style.width = width + 'px';
    }

  };

  // Add a listener for clicking on each parent field
  for (var i = 0; i < fieldContainers.length; i++) {
    // Add the click listener
    fieldContainers[i].addEventListener('click', onClick);

    // Find the child input element
    var editableField = fieldContainers[i].querySelector('.chart-editor__input');

    // Add all the events if the element exists
    if (editableField) {
      editableField.addEventListener('focus', onFocus);

      var inputEvent = 'input';

      if (editableField.type === 'checkbox' || editableField.tagName === 'SELECT') {
        inputEvent = 'change';
      }

      editableField.addEventListener(inputEvent, onInput);

      var ignoredTypes = ['range', 'color', 'checkbox'];

      if (editableField.tagName === 'INPUT' && ignoredTypes.indexOf(editableField.type) === -1) {
        editableField.addEventListener('focus', setInputWidth);
        editableField.addEventListener('input',  setInputWidth);
      }
    }
  }
};