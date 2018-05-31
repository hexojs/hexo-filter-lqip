# hexo-filter-lqip
A Hexo plugins which helps to introduce low quality image placeholders to the theme

![](https://github.com/ertrzyiks/hexo-filter-lqip/raw/master/preview.gif)

## Installation

```
npm i hexo-filter-lqip --save
```

## Usage

Install this plugin for the theme and use the view helper to render a placeholder.


### lqipFor view helper

```js
lqipFor(path_to_asset, options)
```

 - **String** *path_to_asset - a path to the image
 - **Object** *options*
   - **String** *[type]* - a type of placeholder, see the list of [available types](#available-types), defaults to the `default_type` as configured

Returns a CSS value for `background-image` property, which is a simplified version of the original image.

Example for EJS

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

## Available types

### Potrace

Type name: `potrace`

Uses the `posterize` function from [potrace][node-potrace] to generate simplified SVG version of the image. The output
is optimized with [SVGO][svgo] and inlined.

### Color

Type name: `color`

Plain background, the dominant color extracted from the image.

## Configuration

Put your configuration in the theme `_config.yml` under `lqip` key.
You can also use the [overriding theme config][1]
feature of Hexo. Available options are the following:

#### cache

Defaults to 'lqip-cache.json'. Could be a string with a file name of the cache.
You can also set to `false` to disable caching.

Ideally, the cache file should not be checked in into repository.

#### priority

The priority of the `after_generate` filter. Defaults to 10.
You can find more information about priority in [Filter](https://hexo.io/api/filter.html) documentation.

#### default_type

Defaults to `potrace`. Use this type if not specified as a param to `lqip_for` helper.

#### potrace

Configuration specific to `potrace` type. All keys except `canvas_size` are passed to the `posterize` function of [potrace][node-potrace]

##### canvas_size: {width:, height:}
Before the image is passed to potrace, it's resized to this size.

#### Example configuration:

```
lqip:
  default_type: potrace
  potrace:
    canvas_size:
      width: 140
    steps: 2
    color: '#dedede'
    background: transparent
```

## Debugging

If something goes wrong, use `--debug` option to get all information about the generating of the blog and extra
information about low-quality image placeholders processing.

```
hexo generate --debug
```

After changing parameters of placeholder it may be required to clean cache, by removing the cache file manually or with:
```
hexo clean
```

## Example project

You can see it put together in the [hexo-lqip-example][2] repository.

## Out there in the wild

- [ertrzyiks's blog](https://blog.ertrzyiks.me)
- [yummy food blog (in Polish)](https://ertrzyiks.github.io/yummy/)

## Inspirations

- [Using SVG as placeholders ](https://jmperezperez.com/svg-placeholders/)
- [Willian Justen](https://unsplash.com/@willianjusten) pictures used for the demo

[1]: https://hexo.io/docs/configuration.html#Overriding-Theme-Config
[2]: https://github.com/ertrzyiks/hexo-lqip-example
[node-potrace]: https://github.com/Iwasawafag/node-potrace
[svgo]: https://github.com/svg/svgo
