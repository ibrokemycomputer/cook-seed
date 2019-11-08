# A Static Build PoC

[![Netlify Status](https://api.netlify.com/api/v1/badges/3940ba98-f07f-49dd-babf-5122295d9b61/deploy-status)](https://app.netlify.com/sites/ibmc/deploys)

This starter repo provides a static-site demo hooked up to the [Pathfinder Build](https://gitlab.pint.com/pathfinder/build) build process.

## Getting Started

Run this in the terminal from your project's root:

```
npm install
npm run dev
```

This installs the Pathfinder Build dependency and then builds the site locally, which creates the compiled site in `/dist` and makes it available at `localhost:3000`, using BrowserSync for live reloading.

---
## View/Run the site code

There are different modes of viewing the site while working locally.

<details>
  <summary>Running <strong>development</strong> mode locally (live reload)</summary><br>

  To view your codebase locally, run `npm run dev`.

  1. This first runs `/node_modules/pathfinder/scripts/build.js`, which copies the `/src` files to `/dist`, and then modifies them per each the active build plugins.
  2. After the `/dist` folder files are built, `/node_modules/pathfinder/scripts/dev.js` runs, which starts the BrowserSync live-reload server.

  _[Note]:_ By default, files are not minified and link/script elements marked `[data-inline]` are not inlined (retain external file call).  
  This way, when using dev tools to inspect in `localhost`, you see the correct line numbers, etc.

  _[Note]:_ Some functionality may be enabled or disabled only in this environment. In `package.json`, we specify a node environment variable to designate development-mode: `NODE_ENV=development npm run build && node scripts/dev.js`.
  In the various build-plugin files, you'll then see some code affected via:<br>
  `if (process.env.NODE_ENV === 'development')`<br> 
  or<br> 
  `if (process.env.NODE_ENV !== 'development')`.
</details>

---

<details>
  <summary>Running <strong>production</strong> mode locally (http-server)</summary><br>

  To view the static, ready-for-production version of the site locally, run `npm run dev:prod`.

  Instead of running BrowserSync live-reload, it instead runs `http-server` to be a simple, static server. This has the benefit of not injecting the 2 scripts BrowserSync adds, and emulates how the site should look and behave on the production server (pure-static site pages).
</details>

---

<details>
  <summary>Running <strong>firebase serve</strong> mode locally</summary><br>

  To test firebase functionality locally, namely testing redirects in `firebase.json`, run the command `npm run dev:fb`. 

  This runs `firebase serve` against the `/dist` folder.
</details>

---

<details>
  <summary><strong>Production</strong> build only (no browser action)</summary><br>

  If you just need to build the `/dist` directory, run `npm run build:prod`.

  _[Note]:_ The above NPM run script is equivalent to: `NODE_ENV=production npm run build`.
</details>

For both development modes, `dev` (BrowserSync - live reload) and `dev:prod` (http-server), the localhost port should be the same. Check the current port value,
but by default it should be 3000: `localhost:3000`

&nbsp;

## Environment Flags

Some site processes do not need to run every time locally, or they only need to run during deployment, etc. To accommodate this, some features are gated behind Node environment variables.
Some are already added in the various `package.json`-style `npm run xxxx` script calls. Others you may need to manually add to the command line before running your desired Node command.

### Deployment Environments

We currently specify 2 environments via environment variables, `development` and `production`. We use these to enable or disable parts of the build process, either from the core build code or custom, user plugins.

In the terminal, most `npm run xxxx` scripts already set which environment to use. You may also manually set them if necessary, for example: `NODE_ENV=development npm run build`

In a custom build plugin, you may use them in conditionals: `if (process.env.NODE_ENV === 'development') ...`

_[Note]:_ There is a third env. value, `NODE_ENV=stage`, that has its own run script, `npm run build:stage`, in case you want to add/remove features when deployed to a Firebase stage project. 
Out-of-the-box, no internal build processes use this, but you are welcome to use it in your own custom-user build plugins.

&nbsp;

## Build Process

* Builds `/dist`
* Copies `/src` to `/dist`
* Runs any custom-user `before` plugins (runs once)
* Loops through each allowed file, modifying file contents per environment rules and plugin actions:
  * Runs any custom-user `default` plugins (all plugins run per file)
  * Replaces any found es6 template strings with their matching data from the data config reference source
  * Adds missing `http://` protocol to external links to avoid them being treated as internal, relative links
  * Replace include placeholders (`[data-include]`) with their target source
  * Replace inline placeholders (`[data-inline]`) with their target external source
  * Set `<a>` tags whose `[href]` matches the current page as 'active' (`[data-active]`)
  * Store link/script files marked for bundling (`[bundle]`), and replace their 'old' DOM elements with the new bundled-file call
  * Minify the page source (production environments)
  * ~~Optimizes images (Todo)~~
  * ~~Optimizes SVG (Todo)~~
  * ~~Uses Babel to convert ES6 to ES5 (Todo)~~
* Creates `sitemap.xml` file in `/dist`
* Create the bundled `.css` and `.js` files specified in the file loop.
* Runs any custom-user `after` plugins (runs once)

Many build settings can be set in the project's `/config/main.js` instead of trying to find them in the various build-plugin files.

&nbsp;

## Deployment

The result of `npm run build` (and its environment variants) creates a static website (by default `/dist`).

Therefore, you may deploy this directory to your project's server setup (FTP, Firebase, etc.)

### Firebase

To facilitate Firebase deployment (either manually or via CI), add deployment scripts to `package.json` per environment. We recommend this pattern:

```
"deploy:stage": "npm run build:stage && firebase deploy --project project-name-stage --only hosting",
"deploy:prod": "npm run build:prod && firebase deploy --project project-name-live --only hosting"
```

&nbsp;

## NPM Run Scripts

The site includes 'helper' NPM-style run scripts that abstract the underlying, verbose execution code into descriptive, easier-to-type tokens. Type these in the terminal via `npm run xxxx`. As this may change over time, please consult the **scripts** object in `package.json` for the up-to-date scripts.

```
// Build
build          - The Pathfinder build process. Use the dev/stage/prod variants, where necessary, to benefit from environment-specific rules.
build:dev      - Build with dev rules
build:stage    - Build with stage rules
build:prod     - Build with prod rules

// Dev
dev            - Runs the site with live-reload (`BrowserSync`)
dev:bundle     - Creates and uses bundled link/script files instead of the normal, non-bundled source files.
dev:fb         - Runs the site with Firebase items enabled (test redirects)
dev:log        - Shows additional logging in the terminal (page-specific build plugin info)
dev:prod       - Runs the site with a simple, static server (`http-server`)

// Reinstall Node Dependencies
reset          - Removes `node_modules` and `/dist`, and then runs `npm install`
reset:clean    - Removes `node_modules` and `/dist`, but does not run `npm install`
reset:build    - Reinstalls just the Pathfinder Build repo (good for updating version), without installing the rest of the project's packages

// Update Node Dependency Versions
update:check   - Checks all `package.json` dependencies for updates
update:fix     - Updates all out-of-date `package.json` dependencies
```