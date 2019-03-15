module.exports = {
  siteTitle: "PINT",
  siteTitleSeperator: " | ",
  someArray: ['One', 'Two', 'Three'],
  someHtmlArray: ['<li>One</li>', '<li>Two</li>', '<li>Three</li>'],
  testFunction: item => {`<li>${item}</li>`},
  loopable: [
    { 
      dt: "Multi-line strings", 
      dd: "Any new line characters inserted in the source are part of the template string" 
    },
    { 
      dt: "Expression interpolation", 
      dd: "Template strings can contain placeholders. These are indicated by dollar sign and curly braces" 
    },
    { 
      dt: "A third one!", 
      dd: "I always though the curly ones were the parenthesis" 
    }
  ]
};
