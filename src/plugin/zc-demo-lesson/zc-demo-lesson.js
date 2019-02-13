// Namespace
var zcDemoLesson = window.zcDemoLesson || {};

// Store lessons data object
zcDemoLesson.lessons = {
  'basics': {
    chart: {
      type: '#TYPE#',
      title: {
        text: '#TITLE_TEXT#'
      },
      plot: {
        "value-box": {
          "text": "#VB_TEXT#"
        },
        "tooltip": {
          "text": "#TOOLTIP_TEXT#"
        }
      },
      legend: {
        "toggle-action": "#TOGGLE_ACTION#",
        "header": {
          "text": "Legend Header"
        },
        "item": {
          "cursor": "pointer"
        },
        "draggable": true,
        "drag-handler": "icon"
      },
      "scale-x": {
        "values": ["Mon", "Wed", "Fri"]
      },
      series: [{
          "values": [3, 6, 9],
          "text": "apples"
        },
        {
          "values": [1, 4, 3],
          "text": "oranges"
        }
      ]
    },
    fields: {
      '#TITLE_TEXT#': {
        input: 'text',
        max: 25,
        default: window.innerWidth > 980 ? 'Change me please!' : 'Hello World!'
      },
      '#TYPE#': {
        input: 'select',
        default: 'bar',
        values: ['bar', 'area', 'line', 'radar', 'scatter']
      },
      '#TOGGLE_ACTION#': {
        input: 'select',
        default: 'hide',
        values: ['hide', 'remove']
      },
      '#VB_TEXT#': {
        input: 'select',
        values: ['%v', '%t: %v', '%scale-key-value (%v)', ],
        default: '%v'
      },
      '#TOOLTIP_TEXT#': {
        input: 'select',
        values: ['%v', '%scale-key-text<br> %t: %v', ],
        default: '%v'
      }
    }
  },
  'animation': {
    chart: {
      type: 'bar',
      title: {
        text: 'Everybody likes animations!',
        fontSize: 18
      },
      subtitle: {
        text: 'adjust the properties to re-animate the chart'
      },
      plot: {
        animation: {
          delay: '#ANIMATION_DELAY#',
          effect: '#ANIMATION_EFFECT#',
          method: '#ANIMATION_METHOD#',
          sequence: '#ANIMATION_SEQUENCE#'
        }
      },
      series: [{
          "values": [3, 6, 9]
        },
        {
          "values": [1, 4, 3]
        }
      ]
    },
    fields: {
      '#ANIMATION_DELAY#': {
        input: 'select',
        default: 100,
        values: [
          100,
          200,
          500,
          1000
        ]
      },
      '#ANIMATION_EFFECT#': {
        input: 'select',
        default: '4',
        values: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11'
        ]
      },
      '#ANIMATION_METHOD#': {
        input: 'select',
        default: '5',
        values: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6'
        ]
      },
      '#ANIMATION_SEQUENCE#': {
        input: 'select',
        default: '1',
        values: [
          '1',
          '2',
          '3',
          '4'
        ]
      }
    }
  },

  '3d': {
    chart: {
      "type": "#3D_TYPE#",
      title: {
        text: '3D Bar Chart',
        fontSize: 18
      },
      subtitle: {
        text: 'check out the z-axis movement'
      },
      "3d-aspect": {
        "x-angle": "#3D_X#",
        "y-angle": "#3D_Y#",
        "z-angle": "#3D_Z#"
      },
      "series": [{
          "values": [3, 6, 9]
        },
        {
          "values": [1, 4, 3]
        }
      ]
    },
    fields: {
      '#3D_TYPE#': {
        input: 'select',
        default: 'bar3d',
        values: [
          'bar3d',
          'area3d',
          'line3d'
        ]
      },
      '#3D_X#': {
        input: 'range',
        default: -27,
        min: -45,
        max: 45
      },
      '#3D_Y#': {
        input: 'range',
        default: 17,
        min: -45,
        max: 45
      },
      '#3D_Z#': {
        input: 'range',
        default: -2,
        min: -45,
        max: 45
      }
    }
  },
  'zooming': {
    chart: {
      "type": "bar",
      title: {
        text: 'Click & Drag to Zoom',
        fontSize: 18
      },
      subtitle: {
        text: 'the lower window is a controller for zooming'
      },
      "scale-x": {
        "zooming": "#X_ZOOM#",
        "zoom-to": [0, 2]
      },
      "scale-y": {
        "zooming": "#Y_ZOOM#"
      },
      "preview": {
        "visible": "#PREVIEW#"
      },
      "series": [{
          "values": [3, 6, 9, 2, 7, 5]
        },
        {
          "values": [1, 4, 3, 8, 2, 3]
        }
      ]
    },
    fields: {
      '#X_ZOOM#': {
        input: 'checkbox',
        default: true
      },
      '#Y_ZOOM#': {
        input: 'checkbox',
        default: false
      },
      '#PREVIEW#': {
        input: 'checkbox',
        default: true
      }
    }
  },
  'scales': {
    chart: {
      "type": "bar",
      title: {
        text: 'Multiple Scales',
        fontSize: 18
      },
      subtitle: {
        text: 'you can have up to 9 scales on the y-axis'
      },
      "plotarea": {
        "margin-left": "dynamic",
        "margin-right": "dynamic"
      },
      "scale-y": {
        "max-value": 10,
        "label": {
          "text": "#Y_LABEL#"
        }
      },
      "scale-y-2": {
        "label": {
          "text": "#Y2_LABEL#"
        }
      },
      "scale-x": {
        "labels": ['Q2', 'Q3', 'Q4']
      },
      "series": [{
          "values": [3, 6, 9],
          "scales": "scale-x,scale-y"
        },
        {
          "values": [200, 700, 900],
          "scales": "scale-x,scale-y-2"
        }
      ]
    },
    fields: {
      '#Y2_LABEL#': {
        input: 'text',
        default: "Scale Y 2  Title",
        max: 30
      },
      '#Y_LABEL#': {
        input: 'text',
        default: "Scale Y Title",
        max: 30
      }
    }
  },
  'labels': {
    chart: {
      "type": "bar",
      title: {
        text: 'Labels/Annotations',
        fontSize: 18
      },
      subtitle: {
        text: 'mark important events with a label'
      },
      "labels": [{
        "text": "Important",
        "hook": "#LABEL_HOOK#",
        "background-color": "#LABEL_BG#",
        "font-color": "#fff",
        "font-size": 18,
        "callout": true,
        "offset-y": -25
      }],
      "series": [{
          "values": [3, 6, 9]
        },
        {
          "values": [1, 4, 3]
        }
      ]
    },
    fields: {
      '#LABEL_HOOK#': {
        input: 'select',
        default: 'node:plot=0,index=1',
        values: ['node:plot=0,index=1', 'node:plot=1,index=2']
      },
      '#LABEL_BG#': {
        input: 'text',
        default: 'red'
      }
    }
  },
  'mixed': {
    chart: {
      "type": "mixed",
      title: {
        text: 'Multiple Chart Types',
        fontSize: 18
      },
      subtitle: {
        text: 'mix and match chart types in the same graph'
      },
      "plot": {
        "stacked": "#STACKED#"
      },
      "series": [{
          "type": "#S1_TYPE#",
          "values": [3, 6, 9]
        },
        {
          "type": "#S2_TYPE#",
          "values": [1, 4, 3]
        },
        {
          "type": "#S3_TYPE#",
          "values": [2, 8, 4]
        }
      ]
    },
    fields: {
      '#STACKED#': {
        input: 'checkbox',
        default: false
      },
      '#S1_TYPE#': {
        input: 'select',
        default: 'bar',
        values: ['bar', 'line', 'area']
      },
      '#S2_TYPE#': {
        input: 'select',
        default: 'bar',
        values: ['bar', 'line', 'area']
      },
      '#S3_TYPE#': {
        input: 'select',
        default: 'line',
        values: ['bar', 'line', 'area']
      }
    }
  },
  'markers': {
    chart: {
      "type": "bar",
      title: {
        text: 'Scale Markers',
        fontSize: 18
      },
      subtitle: {
        text: 'mark important events with a marker'
      },
      "scale-y": {
        "markers": [{
          "type": "line",
          "range": [3.5],
          "line-width": 3,
          "line-color": "#MARKER_COLOR#",
          "text": "#MARKER_TEXT#",
          "placement": "#MARKER_PLACEMENT#",
          "label-placement": "#LABEL_PLACEMENT#",
          "label-alignment": "#LABEL_ALIGNMENT#"
        }]
      },
      "series": [{
          "values": [3, 6, 9]
        },
        {
          "values": [1, 4, 3]
        }
      ]
    },
    fields: {
      '#MARKER_TEXT#': {
        input: 'text',
        default: 'Profitable',
        max: 25
      },
      '#MARKER_COLOR#': {
        input: 'select',
        default: 'green',
        values: ['green', 'cyan', 'orange']
      },
      '#MARKER_PLACEMENT#': {
        input: 'select',
        default: 'bottom',
        values: ['bottom', 'top']
      },
      '#LABEL_PLACEMENT#': {
        input: 'select',
        default: 'normal',
        values: ['normal', 'opposite']
      },
      '#LABEL_ALIGNMENT#': {
        input: 'select',
        default: 'normal',
        values: ['normal', 'opposite']
      }

    }
  },
}

// Instantiate new lesson instance
zcDemoLesson.lesson = new Lesson({
  chartID: 'jsref-homepage-chart',
  chartHeight: "100%",
  codeID: 'code-output',
  chart: zcDemoLesson.lessons.basics.chart,
  fields: zcDemoLesson.lessons.basics.fields
});
zcDemoLesson.lesson.MONOSPACE_HEIGHT = 14;

// Store `editor` column code block
var editor = document.querySelector('[zc-demo-lesson="editor"]');
var $code = editor.querySelector('pre');
// Store code-block tooltip element
var $tooltip = document.querySelector('[jsref="demo-lesson-tooltip"]');
// Listen for code block scrolling
var currScroll, scrollAttr = 'scrolling';
$code.addEventListener('scroll', function(e) {
  currScroll = e.target.scrollTop;
  if (currScroll && currScroll > 10) $tooltip.setAttribute(scrollAttr,'');
  else $tooltip.removeAttribute(scrollAttr);
});



var switchTab = function () {
  var target = this.value;
  zcDemoLesson.lesson.chart = zcDemoLesson.lessons[this.value].chart;
  zcDemoLesson.lesson.fields = zcDemoLesson.lessons[this.value].fields;
  zcDemoLesson.lesson.render();
  // prettyPrint();
}

zcDemoLesson.lesson.render();
// prettyPrint();

var inputs = document.querySelectorAll('[name="homepage-chart-toggle"]');
var mobileSelector = document.querySelector('.mobile-chart-switcher');

for (var i = 0; i < inputs.length; i++) {
  inputs[i].addEventListener('change', switchTab);
}

mobileSelector.addEventListener('change', switchTab);


// Listen for form submission
var exportTrigger = document.querySelector('[jsref="zc-demo-export"]');
var exportInput = document.querySelector('[jsref="zc-demo-export-input"]');
var exportToCodepen = document.querySelector('[jsref="zc-demo-export-form"]');

exportTrigger.addEventListener('click', function () {
  var js = [
    'var myChart = ' + JSON.stringify(lesson.renderableChartJSON, null, '  ') + ';',
    'zingchart.render({',
    '  id: "myChart",',
    '  data: myChart,',
    '  height: "480",',
    '  width: "100%"',
    '});'
  ].join('\n');

  var inputValue = {
    title: 'My First ZingChart',
    description: 'Exported from https://www.zingchart.com',
    editors: '101',
    tags: ['zingchart', 'chart'],
    html: '<div id="myChart"></div>',
    js: js,
    js_external: 'https://cdn.zingchart.com/zingchart.min.js'
  };

  // Update the input value
  exportInput.value = JSON.stringify(inputValue);

  // Submit the form
  exportToCodepen.submit();
});

var clickMeTooltip = document.querySelector('#interact-with-me');
var codeOutputSelector = document.querySelector('#code-output');
var firstChartEditor = document.querySelector('span.chart-editor');
var chartEditorControls = document.querySelectorAll('div.split-card__content.split-card__bottom.split-card__content--gray label');
var removeTooltipEvent = function () {
  if (clickMeTooltip) {
    // if parent remove element. Else hide it
    if (clickMeTooltip.parentElement) {
      clickMeTooltip.parentElement.removeChild(clickMeTooltip);
    } else {
      clickMeTooltip.style.visibility = 'hidden';
    }
  }
};
// hide tooltip on scroll
if (codeOutputSelector) {
  codeOutputSelector.addEventListener('scroll', function (e) {
    if (e.target && e.target.scrollTop < 16) {
      if (clickMeTooltip)
        clickMeTooltip.style.visibility = 'visible';
    } else {
      if (clickMeTooltip)
        clickMeTooltip.style.visibility = 'hidden';
    }
  });
}
// hide tooltip on click
if (firstChartEditor) {
  firstChartEditor.click();
  firstChartEditor.addEventListener('click', removeTooltipEvent);
}

// hide tooltip when clicking on labels
if (chartEditorControls) {
  for (var i = 0; i < chartEditorControls.length; i++) {
    if (chartEditorControls[i]) {
      chartEditorControls[i].addEventListener('click', function (e) {
        if (e.target) {
          if (clickMeTooltip)
            removeTooltipEvent();
        }
      });
    }
  }
}
// hide tooltip after 25 seconds
setTimeout(function () {
  // if window loaded correctly
  if (clickMeTooltip)
    removeTooltipEvent();
}, 25500);
