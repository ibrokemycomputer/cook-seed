// EXPORT
// -----------------------------
module.exports = {
  // REQUIRED (CORE)
  // Convert xxxx.html files to xxxx/index.html
  // NOTE: If `disabled` set to `true`, you must add the .html extension in <a href="xxxx.html"> paths
  convertPageToDirectory: {
    disabled: false,
    excludePaths: ['dist/404.html']
  },
  // The name of the compiled, 'public' directory (`dist`, `public`, etc.)
  distPath: 'dist',
  // The path to the dev source files. This is used for running the local dev livereload server.
  srcPath: 'src',
  // The file to load in `srcPath` if not `index.html`
  startPath: 'index.html',
  // The URL domain to use for the `sitemap.xml` entries
  // Note: Enabling this auto-generates `sitemap.xml` in the `/dist` directory
  // sitemapUrl: 'https://www.domain.com',

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
  // parentActiveAttr: 'zc-parent-active',

  // Change the default [attribute] for includes and inline link/scripts
  //includeAttr: 'include',
  //inlineAttr: 'inline',

  // Disable `replaceTemplateStrings` build process step
  // enableTemplateStringReplace: false,

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
