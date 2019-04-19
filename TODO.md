# TODO

1. **More documentation!**

## Site

Image optimizer.  
Some sort of `noscript` warning.  
A no-css warning/fallback.  
Do something if user has images disabled.  
Page transitions/app-shell.  


### Plugins

* Add image optimization plugin
* SCSS plugin?

### Other

* Add opt-in to set active state on parent of nested pages

## Build

* Double check all settings (make sure they dont fail if unset, and document defaults/requirements)

* Currently, when making a change, all files are checked/updated. Instead, need to only update `/dist` with delta changes.

* Fix nested-page extensions and/or remove 'auto-generate folder + `index.html`' feature
  * Both pages resolve/load, which will cause analytics issues

* Add some file type checking/error handling to the template string replacement

## Babel

~~Fix issue of needing to install babel packages in the site repo!~~ (check this on a Mac before removing)

1. [HOLD] Babelify inline scripts?