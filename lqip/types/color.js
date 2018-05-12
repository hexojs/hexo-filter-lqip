var sharp = require('sharp')
var quantize = require('quantize')

function extractPixels(buffer) {
  var pixels = []
  var pixel = []

  for (var i = 0; i < buffer.length; i++) {
    pixel.push(buffer[i])

    if (pixel.length >= 3) {
      pixels.push(pixel.slice())
      pixel.splice(0, pixel.length)
    }
  }

  return pixels
}

function generate (path, buffer, options) {
  options = options || {}
  var canvasSize = options.canvas_size || {width: 10}

  return sharp(buffer)
    .resize(canvasSize.width, canvasSize.height)
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(function (image) {
      var pixels = extractPixels(image.data)
      var colorMap = quantize(pixels, 2)
      var color =  colorMap.palette()[0]
      return '#' + Buffer.from(color).toString('hex')
    })
}

function serialize (value) {
  return 'linear-gradient(' + value + ', ' + value + ')'
}

module.exports = {
  generate: generate,
  serialize: serialize
}
