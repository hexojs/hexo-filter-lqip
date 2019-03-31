var Promise = require('bluebird')

var getCache = require('./cache')
var types = require('./types')
var replace = require('string-replace-async')
var loadFileContent = require('./utils').loadFileContent
var getTypeName = require('./utils').getTypeName
var base64Decode = require('./utils').base64Decode

function processType(options) {
  var hexo = options.hexo
  var content = options.content
  var type = options.type
  var config = options.config
  var stats = options.stats
  var cache = getCache(config)

  var name = getTypeName(type)
  var generate = types[type].generate
  var serialize = types[type].serialize

  var regex = new RegExp('__' + name + '\\([^\\(]+\\)', 'g')

  return replace(content, regex, function (placeholder) {
    var matches = placeholder.match('__' + name + '\\(([^\\(]+)\\)')
    var url = base64Decode(matches[1])
    var stream = hexo.route.get(url)

    if (stream == null) {
      return Promise.reject(new Error('Can not find file: ' + url))
    }

    return loadFileContent(stream)
      .then(function (buffer) {
        var cached = cache.getCache(url, type)
        if (cached) {
          stats.addCached()
          hexo.log.debug('[LQIP] Generating `' + type + '` type for ' + url + ' (from cache)')
          return cached
        }

        stats.addGenerated()
        hexo.log.debug('[LQIP] Generating `' + type + '` type for ' + url)
        return generate(url, buffer, config[type])
      })
      .then(function (data) {
        cache.saveCache(url, type, data)
        return serialize(data)
      })
  })
}

exports.processHtmlFile  = function processHtmlFile(options) {
  var hexo = options.hexo
  var initialContent = options.content
  var config = options.config
  var stats = options.stats

  return Promise.reduce(Object.keys(types), function(content, type) {
    return processType({
      hexo: hexo,
      content: content,
      type: type,
      config: config,
      stats: stats
    })
  }, initialContent)
}
