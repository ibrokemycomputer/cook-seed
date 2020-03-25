# Templating Guide

## Core Concepts

Some of the main features of `cook` are PHP-like "includes", ability to inline scripts/styles, and a very customisable plugin system for anything that isn't already baked in.

### Includes

To "include" an HTML snippet in a page, simply add `data-include` to an element in a page. The element that this attribute is added to will be _removed_, and replaced with the content of the included file. Included files must be `.html` files, and the extension is optional in the attribute value.

#### Example

index.html

```html
<html>
  <body>
    <div data-include="/includes/header"></div>
    <p>Hello world!</p>
  </body>
</html>
```

includes/header.html

```html
<nav>
  <a href="/about">About</a>
  <a href="/portfolio">Portfolio</a>
  <a href="/contact">Contact</a>
</nav>
```

After building, index.html will look like:

```html
<html>
  <body>
    <nav>
      <a href="/about">About</a>
      <a href="/portfolio">Portfolio</a>
      <a href="/contact">Contact</a>
    </nav>
    <p>Hello world!</p>
  </body>
</html>
```

`data-include` also works on self-closing tags, such as `<meta data-include="/includes/global-head">`. 

In addition, you can _nest_ includes! `cook` will loop through recursively until all elements with `data-include` have been replaced.

### Inlining Assets

`cook` also can inline assets, perfect for inserting critical CSS in the `<head>` of the document without having to manually edit every page when there is an update. Inlining an asset with `data-inline` is very similar to how the `data-include` attribute is used. `data-inline` will also differentiate between `script` and `link` tags automatically!

#### Examples

**CSS**

index.html

```html
<link rel="stylesheet" href="/assets/css/critical.css" data-inline>
```

assets/css/critical.css

```css
body { font-family: 'Comic Sans', serif; }
```

ouput

```html
<style>body { font-family: 'Comic Sans', serif; }</style>
```

**Javascript**

index.html

```html
<script src="/assets/js/critical.js" data-inline></script>
```

assets/js/critical.js

```javascript
console.log('This is the most important code on the site!');
```

output

```html
<script>console.log('This is the most important code on the site!');</script>
```