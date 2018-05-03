var util = require('util')
var Promise = require('bluebird')
var streamToArray = require('stream-to-array')
var streamToArrayAsync = Promise.promisify(streamToArray)

exports.isHtmlFile = function isHtmlFile(filePath) {
  return filePath.match(/\.html$/)
}

exports.loadFileContent = function loadFileContent(stream) {
  return streamToArrayAsync(stream).then(function (parts) {
    const buffers = parts.map(function (part) {
      return util.isBuffer(part) ? part : Buffer.from(part)
    });

    return Buffer.concat(buffers);
  })
}
