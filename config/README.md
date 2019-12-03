# Configuration Settings

There are two primary config files the user can modify to tailor the build process to their needs:

* `data.js`
* `main.js`


## data.js

`data.js` is the 'top-level store' of Pathfinder. Adding data to the exported object makes it available in each build-process step, including user's custom build plugins.

It is purposely sparse, by default:

```
module.exports = {
  siteTitle: 'PINT',
  siteTitleSeperator: ' | ',
};
```

`siteTitle` and `siteTitleSeperator` are automatically added to each page's `<title>` tag, and may be used in conjunction with manually-added content. For example,
a page's title tag may look like this: `<title>About Us${siteTitleSeperator}${siteTitle}</title>`.<br>
When rendered, it will replace the variables with the config data: `<title>About Us | PINT</title>`.

---

## main.js

This is the optional configuration file for tailoring the build process to the project's needs. It must be found at `/config/main.js` in your project repo. 

The build process itself maintains an internal configuration file of default settings. Any user-added changes overrides the internal defaults via `Object.assign()`.

Although the user config file is technically not required, in practice you will likely want to leverage build functionality that produces site-specific output.

For example, to automatically create the `/dist/sitemap.xml` file, the build process will need to know the project's domain (TLD), represented in the config as:

```
sitemap: {
  url: 'https://www.site.com',
}
```

### Configuration Options

#### Core Options

<table>
  <tr>
    <th>Token</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <!-- Pathing -->
  <tr>
    <td><code>srcPath</code></td>
    <td><code>src</code></td>
    <td>The path to the dev source files. This is where files are watched when running the local dev livereload server.</td>
  </tr>
  <tr>
    <td><code>distPath</code></td>
    <td><code>dist</code></td>
    <td>The path to the compiled, 'public' directory (<code>dist</code>, <code>public</code>, etc.). This is where the results of the build process are created for deployment.</td>
  </tr>
  <tr>
    <td><code>startPath</code></td>
    <td><code>index.html</code></td>
    <td>The file to load as the starting page when running the live-reload dev process.</td>
  </tr>
  <!-- Sitemap -->
  <tr>
    <td><code>sitemap</code></td>
    <td><code>{}</code></td>
    <td>Contains options for the automatic building of <code>/sitemap.xml</code></td>
  </tr>
  <tr>
    <td colspan="3">
      <table>
        <tr>
          <td><code>url</code></td>
          <td><code>undefined</code></td>
          <td>There is no default. The sitemap is not built unless a value is set by the user.<br><br>
          Example: <code>url: 'https://www.site.com'</code></td>
        </tr>
        <tr>
          <td><code>excludePaths</code></td>
          <td><code>[<br>
            &nbsp;&nbsp;/\/assets/,<br>
            &nbsp;&nbsp;/\/includes/,<br> 
            &nbsp;&nbsp;/^\/404.html/
          ]</code></td>
          <td>Exclude files from sitemap by adding the desired path regex.<br><br>
          Defaults are: Any <code>/assets</code> or <code>/includes</code> paths, and the root <code>404.html</code></td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Convert to directory -->
  <tr>
    <td><code>convertPageToDirectory</code></td>
    <td><code>{}</code></td>
    <td>The default behavior of the build process is to convert <code>.html</code> pages into directories, to obfuscate the page extension and to have clean URLS.<br><br>
    This process guarantees the paradigm for deployment environments that don't do this automatically (For example, 'clean urls' is a config option for Firebase, but is not for other services).<br><br>
    Example: <code>/test/page.html</code> becomes <code>/test/page/index.html</code> and is navigable in the browser as <code>/test/page/</code>.</td>
  </tr>
  <tr>
    <td colspan="3">
      <table>
        <tr>
          <td><code>disabled</code></td>
          <td><code>false</code></td>
          <td>This process is enabled by default. Set <code>true</code> to disable and keep the default files with extensions.</td>
        </tr>
        <tr>
          <td><code>excludePaths</code></td>
          <td><code>['dist/404.html']</code></td>
          <td>Add paths to exclude specific files. For example, browsers or services expect a root level <code>404.html</code>, not <code>/404/</code></td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Bundle CSS and JS -->
  <tr>
    <td><code>bundle</code></td>
    <td><code>{}</code></td>
    <td>
  </tr>
  <tr>
    <td colspan="3">
      <table>
        <tr>
          <td><code>distPath</code></td>
          <td><code>'assets/bundle'</code></td>
          <td>The directory newly-bundled <code>CSS</code> and <code>JS</code> files are created in.</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

#### Project-Specific

<table>
  <tr>
    <th>Token</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <!-- Pathing -->
  <tr>
    <td><code>pluginPath</code></td>
    <td><code>'plugins'</code></td>
    <td>The repo directory path where the build process looks for any user-defined build-process plugins. By default, it looks for <code>.js</code> files in <code>/plugins</code> on the repo root.
    <hr>
    <strong>Note:</strong> It is recommended this directory lives outside the source directory, since these plugins are only for the build process and you likely don't want them included in your deployable code.</td>
  </tr>
  <!-- Pathing -->
  <tr>
    <td><code>plugins</code></td>
    <td><code>{}</code></td>
    <td>Object collection of user-defined build plugins that affect the build process as 'pre', 'post', and 'per-file' hooks.<br><br>
    Matching plugin files must be located on the project's root in <code>/plugins</code>.<br><br>
    Example:<br><code>
    plugins: {<br>
      &nbsp;&nbsp;before: ['myPlugin']<br>
    }
    </code><br>
    where <code>myPlugin</code> is the filename of the desired .js plugin file in the plugins directory: <code>/plugins/myPlugin.js</code>
    <hr>
    <strong>Note:</strong> The left-right order of the plugins represents their execution order. If one plugin requires another to have run, it needs to be after that dependent plugin.</td>
  </tr>
  <tr>
    <td colspan="3">
      <table>
        <tr>
          <td><code>before</code></td>
          <td><code>[]</code></td>
          <td>Array of string names representing plugin class names that run once, before the main file loop, which loops through each allowed site page.<br>
          Example: You need to fetch markdown source from another repo, and convert its source to DOM, before creating the .html page and minifying its source.</td>
        </tr>
        <tr>
          <td><code>default</code></td>
          <td><code>[]</code></td>
          <td>Array of string names representing plugin class names that run once per file.<br><br>
          Example: The internal plugins for replacing included code, or minifying the source.
          <hr>
          <strong>Note:</strong> For these 'per page' plugins, the user-defined plugins run before any of the default internal plugins.</td>
        </tr>
        <tr>
          <td><code>after</code></td>
          <td><code>[]</code></td>
          <td>Array of string names representing plugin class names that run once, after the main file loop, which loops through each allowed site page.<br><br>
          Example: You stored each page's final content for Algolia indexing, but instead of posting to Algolia after each file,
          you run a batch POST once at the end.</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

#### Optional

<table>
  <tr>
    <th>Token</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <!-- Pathing -->
  <tr>
    <td><code>includePaths</code></td>
    <td><code>[]</code></td>
    <td>Add regex patterns to include files for modifying once copied to the /dist directory. By default, any <code>.html</code>, <code>.css</code>, and <code>.js</code> files are eligible for modification, unless they have already been specifically excluded (404 page, vendor JS files, etc.) - See <code>excludePaths</code> below.<br>
    For atypical file types, like <code>.json</code>, which are allowed but not automatically targeted, you must specify individual files for manipulation.<br><br>
    For example, adding <code>/dist\/manifest.json/</code> will include the <code>manifest.json</code> file, so any template strings inside of it can be converted.<br><br>
    Entries can be single regexes: <code>/dist\/path/</code> or <code>new RegExp(/dist\path/)</code><br>
    Or regexes in an array: <code>[/dist\/path1/, new RegExp(/dist\path2/)]</code></td>
  </tr>
  <tr>
    <td><code>excludePaths</code></td>
    <td><code>[/dist\/assets\/vendor/]</code></td>
    <td>Add regex patterns to exclude files for modifying once copied to the /dist directory. By default, any <code>.html</code>, <code>.css</code>, and <code>.js</code> files are eligible for modification, unless they have already been specifically excluded (404 page, vendor JS files, etc.)<br><br>
    For atypical file types, like <code>.json</code>, which are allowed, but not affected by default, you must specify individual files to be manipulated.<br><br>
    For example, <code>/dist\/vendor/</code> will exclude files in <code>/dist/vendor</code>, since vendor files typically are already minified, etc.<br><br>
    Entries can be single regexes: <code>/dist\/path/</code> or <code>new RegExp(/dist\path/)</code><br>
    Or regexes in an array: <code>[/dist\/path1/, new RegExp(/dist\path2/)]</code></td>
  </tr>
  <tr>
    <td><code>activeLink</code></td>
    <td><code>{}</code></td>
    <td>By default, <code>&lt;a&gt;</code> tags whose <code>href</code> value matches the current page automatically gets <code>class="active"</code> applied. Additionally, any link whose href value contains a hierarchical portion of the current-page URL gets a parent state: <code>class="active-parent"</code><br>
    To change the state values, or the class to an attibute, use the following options:</td>
  </tr>
  <tr>
    <td colspan="3">
      <table>
        <tr>
          <td><code>type</code></td>
          <td><code>'class'</code></td>
          <td>By default, the link has the active state applied as a class attribute: <code>&lt;a class="active"&gt;</code>. To change to a data attribute, set the type option to <code>'attr'</code> or <code>'attribute'</code>.<br><br>
          For example, if setting the type to an attribute, the link will serve an attribute instead of the class: <code>&lt;a data-active&gt;</code>
          <hr>
          <strong>Note:</strong> Any other value for type causes a class to be used.</td>
        </tr>
        <tr>
          <td><code>activeState</code></td>
          <td><code>'active'</code></td>
          <td>The class value or attribute label for the link that represents the current page.</td>
        </tr>
        <tr>
          <td><code>parentState</code></td>
          <td><code>'active-parent'</code></td>
          <td>The class value or attribute label for the link that represents the current page's ancestor.</td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Includes -->
  <tr>
    <td><code>includeAttr</code></td>
    <td><code>'include'</code></td>
    <td>By default, when including a bit of code into another, you add the attribute <code>include</code> or <code>data-include</code>.<br>
    Use this option to change that token keyword.<br><br>
    Example: <code>&lt;div include="path/to/include.html"&gt;</code>.<br>Setting to <code>'incl'</code> would instead enable <code>incl="..."</code> or <code>data-incl="..."</code>.</td>
  </tr>
  <!-- Inlining -->
  <tr>
    <td><code>inlineAttr</code></td>
    <td><code>'inline'</code></td>
    <td>By default, when inlining a bit of external CSS or JS, you add the attribute <code>inline</code> or <code>data-inline</code> to the external file element.<br>
    Use this option to change that token keyword.<br><br>
    Example: <code>&lt;script src="path/to/script.js" data-inline&gt;</code>.<br>Setting to <code>'my-inline'</code> would instead enable <code>&lt;script src="..." my-inline&gt;</code> or <code>&lt;script src="..." data-my-inline&gt;</code>.</td>
  </tr>
  <!-- Live Reload -->
  <tr>
    <td><code>watch</code></td>
    <td><code>[]</code></td>
    <td>By default, the <code>npm run dev</code> live-reload process watches <code>/assets/css</code>, <code>/assets/plugin</code> (.css and .js), and all <code>.html<code> by default. To include other files to be watched, so that the live-reload rebuilds when that file is changed, add the path as a comma-separated array-string entry.</td>
  </tr>
  <tr>
    <td><code>watchReplace</code></td>
    <td><code>false</code></td>
    <td>By default, any files added to the <code>watch</code> option above are watched <strong>in addition</strong> to the default file paths. To only watch the files added by the user, set this option to <code>true</code>.</td>
  </tr>
</table>