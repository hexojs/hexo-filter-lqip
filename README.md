# hexo-filter-lqip
A Hexo plugins which helps to introduce low quality image placeholders to the theme

![](https://github.com/ertrzyiks/hexo-filter-lqip/raw/master/preview.gif)

## Installation

```
npm i ertrzyiks/hexo-filter-lqip --save
```

## Usage

Install this plugin for the theme and use the view helper to render a placeholder.


### lqipFor view helper

```js
lqipFor(path_to_asset, options)
```

 - **String** *path_to_asset*
 - **Object** *options*
   - **String** *[type]*

Returns a CSS value for `background-image` property, which is a simplified version of the original image.

#### Example for EJS
```ejs
<div
  style="background-image: <%- lqip_for('/content/my-photo.jpg') %>"
></div>
```

### Front-end integration

To make it work as a real placeholder, there must be a piece of JavaScript code, which will eventually replace the placeholder
with the original image. It can be done by adding a data attribute with the original image path:

```ejs
<div
  style="background-image: <%- lqip_for('/content/my-photo.jpg') %>"
  data-lazy-src="/content/my-photo.jpg"
></div>
```

and replacing the `background-image` CSS property with the original image once it's loaded:

```js
(function () {
  var lazyImages = document.querySelectorAll('[data-lazy-src]')

  lazyImages.forEach(function (img) {
    var url = img.dataset.lazySrc
    var image = new Image()
    image.onload = function () {
      img.style.backgroundImage = 'url(' + url + ')'
    }
    image.src = url
  })
})()
```

For even more improvement, the script could load only images that are visible on the screen.

### Example project

You can see it put together in the [hexo-lqip-example](https://github.com/ertrzyiks/hexo-lqip-example) repository.

### Inspirations

- [Using SVG as placeholders ](https://jmperezperez.com/svg-placeholders/)
- [Willian Justen](https://unsplash.com/@willianjusten) pictures used for the demo
