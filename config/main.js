// EXPORT
// -----------------------------
module.exports = {
  // Convert xxxx.html files to xxxx/index.html
  // NOTE: If set to `false`, you must add the .html extension in <a href="xxxx.html"> paths
  convertPageToDirectory: true,
  // The name of the compiled, 'public' directory (`dist`, `public`, etc.)
  distPath: 'dist',
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
  // By default, external links that start with `www` or `cdn` and don't have a protocol manually set (`http://` or `https://`)
  // have `http://` added so the build doesn't think they are local links. To skip, or add to, define your own value array.
  // replaceExternalLinkProtocol: { enabled: true, match: ['cdn'] },
  // The path to the dev source files. This is used for running the local dev livereload server.
  srcPath: 'src',
  // The file to load in `srcPath` if not `index.html`
  startPath: 'index.html',
  // Live reload dev browser when these files change (`/assets/css`,`/assets/plugin` (.css and .js), and all `.html` by default)
  // Note: Adding paths here will not 'add' to the defaults, but will instead override them
  //watch: [ '/css/*.css', ],
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
