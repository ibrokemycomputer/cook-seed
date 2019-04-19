# TODO

## Site

### Plugins

* Add image optimization plugin
* SCSS plugin?

### Other

* Add opt-in to set active state on parent of nested pages

## Build

* Currently, when making a change, all files are checked/updated. Instead, need to only update `/dist` with delta changes.

* Fix nested-page extensions and/or remove 'auto-generate folder + `index.html`' feature
  * Both pages resolve/load, which will cause analytics issues

* Add some file type checking/error handling to the template string replacement

## Babel

### Setup

**Fix issue of needing to install babel packages in the site repo!**

### Compiling

1. Babelify `config.customBabelDirs` or something similar?

### Markup

1. Babelify inline scripts?