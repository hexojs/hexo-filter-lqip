var Promise = require('bluebird')
var potrace = require('potrace')
var sharp = require('sharp')
var posterize = Promise.promisify(potrace.posterize)
var svgo = require('../svgo')()

function generate(path, buffer, options) {
  options = options || {}
  var canvasSize = options.canvas_size || {width: 140}

  return sharp(buffer)
    .resize(canvasSize.width, canvasSize.height)
    .toBuffer()
    .catch(e => {
      throw new Error('Error during processing of "' + path + '":' + e.message)
    })
    .then(function (buffer) {
      return posterize(buffer, options)
    })
    .then(function (data) {
      return svgo.optimize(data).then(function (result) {
        return result.data
      })
    })
}

function serialize(value) {
  return "url('data:image/svg+xml," + encodeURI(value) + "')"
}

module.exports = {
  generate: generate,
  serialize: serialize
}
