// EXPORT
// -----------------------------
module.exports = {

  // REQUIRED (CORE BUILD PROCESS REQUIREMENTS)
  // --------------------------------------------
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


  // OPTIONAL
  // -----------------------------
};
