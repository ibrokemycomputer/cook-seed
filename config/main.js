// EXPORT
// -----------------------------
module.exports = {

  // REQUIRED (CORE BUILD PROCESS REQUIREMENTS)
  // --------------------------------------------

  // Convert xxxx.html files to xxxx/index.html
  // NOTE: If `disabled` set to `true`, you must add the .html extension in <a href="xxxx.html"> paths
  // NOTE: `404.html` is excluded, since Firebase looks for the .html file, not a directory
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
  sitemap: {
    url: 'https://www.site.com',
    // Exclude files from sitemap by adding the desired path regex
    // Defaults are: Any `/assets` or `/includes` paths, and the root `404.html`
    // excludePaths: [/\/assets/, /\/includes/, /^\/404.html/],
  },

  
  // REQUIRED (SITE-SPECIFIC CONFIG)
  // ---------------------------------
  // Add config items here for your own custom build plugins

  // Build-Process Plugins: Add per-site plugins to use during build process
  // NOTE: `zgReplaceTokens` needs to come before `zgDocsBuildNavs`, 
  // since the former creates the markup the latter reads to build the in-page docs nav
  plugins: {
    before: [],
    default: [],
    after: [],
  },
  // pluginPath: 'plugins',

  // CSS and JS Bundling
  bundle: {
    // Path in 'dist' directory where the bundled files will be created
    distPath: 'assets/bundle',
  },


  // OPTIONAL
  // -----------------------------

  // Add regex patterns to exclude files from being modified once copied to the /dist directory
  // For example, /dist\/vendor/ will exclude files in /dist/vendor 
  // Can be single regexes: /dist\/path/ or new RegExp(/dist\path/)
  // Or regexes in an array: [/dist\/path/, new RegExp(/dist\path/)]
  // -- Example: Exclude docs templates directory (/dist/assets/docs/)
  excludePaths: [
    // Current
    /dist\/assets\/vendor/, 
  ],
  
  // Set custom 'active' state on links whose [href] matches the current window location path (link active state - defaults as `data-active`)
  // activeAttr: 'zg-active',
  // parentActiveAttr: 'zg-parent-active',
  
  // Change the default [attribute] for includes and inline link/scripts
  //includeAttr: 'include',
  //inlineAttr: 'inline',
  
  // Live reload dev browser when these files change (`/assets/css`,`/assets/plugin` (.css and .js), and all `.html` by default)
  // Note: Added paths here are *in addition* to the defaults. To replace the defaults, set the `watchReplace` option listed below
  // watch: [ 
  //   '/pricing/css/*.css', 
  // ],
  // Set this option to only watch the paths listed in this config file and not the default paths
  //watchReplace: true,

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
