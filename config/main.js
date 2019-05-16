// EXPORT
// -----------------------------
module.exports = {
  // REQUIRED (CORE)
  // Convert xxxx.html files to xxxx/index.html
  // NOTE: If set to `false`, you must add the .html extension in <a href="xxxx.html"> paths
  convertPageToDirectory: true,
  // The name of the compiled, 'public' directory (`dist`, `public`, etc.)
  distPath: 'dist',
  // The path to the dev source files. This is used for running the local dev livereload server.
  srcPath: 'src',
  // The file to load in `srcPath` if not `index.html`
  startPath: 'index.html',

  // REQUIRED (SITE)
  // Add config items here for your own custom build plugins

  // OPTIONAL
  // Add regex patterns to exclude files from being modified once copied to the /dist directory
  // For example, /dist\/vendor will exclude files in /dist/vendor 
  // Can be single regexes: /dist\/path/ or new RegExp(/dist\path/)
  // Or regexes in an array: [/dist\/path/, new RegExp(/dist\path/)]
  //excludePaths: [/dist\/vendors/],

  // Set custom 'active' state on links whose [href] matches the current window location path (link active state - defaults as `data-active`)
  // activeAttr: 'zc-active',

  // Change the default [attribute] for includes and inline link/scripts
  //includeAttr: 'include',
  //inlineAttr: 'inline',

  // Live reload dev browser when these files change (`/assets/css`,`/assets/plugin` (.css and .js), and all `.html` by default)
  // Note: Added paths here are *in addition* to the defaults. To replace the defaults, set the `watchReplace` option listed below
  //watch: [ '/docs/css/*.css', ],
  // Set this option to only watch the paths listed in this config file and not the default paths
  //watchReplace: true,

  // Add per-site plugins to use during build process
  // plugins: ['testLogger'],
  // customData: 'getWordpressData',
  // babelOpts: {
  //   "plugins": ["@babel/plugin-transform-classes"],
  //   "presets": [
  //     ["@babel/preset-env", {
  //       "targets": {
  //         "browsers": [
  //           "> 1%",
  //           "last 2 versions",
  //           "not ie <= 11"
  //         ]
  //       }
  //     }]
  //   ]
  // }
};
