var util = require('util')
var Promise = require('bluebird')
var streamToArray = require('stream-to-array')
var streamToArrayAsync = Promise.promisify(streamToArray)

exports.isHtmlFile = function isHtmlFile(filePath) {
  return filePath.match(/\.html$/)
}

exports.loadFileContent = function loadFileContent(stream) {
  return streamToArrayAsync(stream).then(function (parts) {
    var buffers = parts.map(function (part) {
      return util.isBuffer(part) ? part : Buffer.from(part)
    });

    return Buffer.concat(buffers);
  })
}

exports.getTypeName = function getTypeName(type) {
  return type.toUpperCase()
}

exports.svgToDataUri = function (svg) {
  return 'data:image/svg+xml,' + encodeURIComponent(collapseWhitespace(svg)).replace(/%[\dA-F]{2}/g, specialHexEncode)
}

function collapseWhitespace(svg) {
  return svg.trim().replace(/\s+/g, ' ')
}

function specialHexEncode(match) {
  switch (match) { // Browsers tolerate these characters, and they're frequent
    case '%20': return ' '
    case '%3D': return '='
    case '%3A': return ':'
    case '%2F': return '/'
    default: return match
  }
}
