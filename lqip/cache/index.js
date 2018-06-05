var nocache = require('./nocache')
var filecache = require('./filecache')

var _memo = {}

module.exports = function (config) {
  if (config.cache === false) {
    _memo.nocache = _memo.nocache || nocache()
    return _memo.nocache
  }

  _memo.filecache = _memo.filecache || filecache(config.cache)
  return _memo.filecache
}
