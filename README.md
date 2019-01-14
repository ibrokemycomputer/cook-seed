# A Static Build PoC

```
npm install
npm run dev
```

---

## Build Process

* Builds `/dist`
* Copies `/src` to `/dist`
* Replaces file content with plugin actions:
  - Inline 'external' file calls (link, script, etc.)
  - Replace/inline include files (`[include]`)
  - Set `<a>` tags whose `[href]` matches the current page as 'active' (`[active]`)
* Minifies code in `/dist`

Many build settings can be set in `config/main.js` instead of trying to find them in the various build plugin files.


## View/Run the site code

For both the `dev` mode (liveReload) and `production` (http-server), the localhost port should be the same. Check the current port value,
but by default it should be 3000: `localhost:3000`

### Running `development` mode locally

To view your codebase locally, run `npm run dev`.

2. This first runs `/scripts/build.js`, which copies the `/src` files to `/dist` and then modifies them per the build plugins
1. Then runs `/scripts/dev.js`, which starts the liveReload server

_[Note]:_ By default, files are not minified and link/script elements marked `[inline]` are not inlined (retain external file call). 
This way, when using dev tools to inspect in `localhost`, you see the correct line numbers, etc.

_[Note]:_ To facilitate this, in `package.json`, we set a node environment var to designate development-mode: `NODE_ENV=development npm run build && node scripts/dev.js`.
In the various build plugin-files, you'll see some plugins' execution blocked in 'dev-mode': `if (process.env.NODE_ENV === 'development')` or `if (process.env.NODE_ENV !== 'development')`.

### Running `production` mode locally

To view the static, ready-for-production version of the site locally, run `npm run dev:prod`.

Instead of running liveReload, it instead runs `http-server` to be a simple, static server. This has the benefit of not
injecting the 2 scripts liveReload adds and emulates how the site should look and behave on the production server (pure static site pages).

### Running pure `production` build

To just build the `/dist` directory only, run `npm run build`. This just runs the build process directly: `node scripts/build.js`.


## TODO

* Currently, when making a change, all files are checked/updated. Instead, need to only update `/dist` with delta changes.
* Can we add the `replace()` internal plugins in a callback so that they are listed/init in `build.js` instead of `plugins/replace.js`. 
  The challenge here is that in `replace()`, we load and write to the file once for performance instead of needing to do so in each plugin for the same file. 
  I'm not sure how this would look or work, needs exploring. Currently you add plugins in 2 places: `build.js` and `replace.js`.