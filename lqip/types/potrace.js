var Promise = require('bluebird')
var potrace = require('potrace')
var sharp = require('sharp')
var posterize = Promise.promisify(potrace.posterize)
var svgo = require('../svgo')()

function generate(buffer, options) {
  return sharp(buffer)
    .resize(140)
    .toBuffer()
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
  name: 'LQIP_POTRACE',
  generate: generate,
  serialize: serialize
}
