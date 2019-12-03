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

  // Add regex patterns to include or exclude files from being modified once copied to the /dist directory
  // For example, /dist\/manifest.json/ will include the manifest.json file, so template strings can be
  // For example, /dist\/vendor/ will exclude files in /dist/vendor 
  // Can be single regexes: /dist\/path/ or new RegExp(/dist\path/)
  // Or regexes in an array: [/dist\/path1/, new RegExp(/dist\path2/)]
  // --
  // INCLUDE
  // -- Example: Include `/dist/manifest.json`, so template strings can be replaced.
  // includePaths: [
  //   /dist\/manifest.json/,
  // ],
  // EXCLUDE
  // -- Example: Exclude docs templates directory (/dist/assets/docs/)
  excludePaths: [
    /dist\/assets\/vendor/, 
  ],
  
  // Define the 'active' state for both links whose `[href]` value matches the current page,
  // as well as links who have part of the current page's url in them (parent-active state)
  // By default, a `[class]` is added, with default values. The below config is not necessary,
  // unless you want to change the type (attr|attribute|class), or the values
  // activeLink: {
  //   // Default: class
  //   type: 'class',
  //   // Default: active
  //   activeState: 'active',
  //   // Default: active-parent
  //   parentState: 'active-parent',
  // },
  
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
