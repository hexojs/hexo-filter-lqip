var nocache = require('./cache/nocache')
var filecache = require('./cache/filecache')

module.exports = function (config) {
  if (config.cache === false) {
    return nocache()
  }

  return filecache(config.cache)
}
