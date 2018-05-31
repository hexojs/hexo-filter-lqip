var Promise = require('bluebird')
var replace = require('string-replace-async')

var getCache = require('./cache')
var types = require('./types')
var isHtmlFile = require('./utils').isHtmlFile
var loadFileContent = require('./utils').loadFileContent

function processType(hexo, content, type, config) {
  var cache = getCache(config)

  var name = getTypeName(type)
  var generate = types[type].generate
  var serialize = types[type].serialize

  var regex = new RegExp('__' + name + '\\([^\\(]+\\)', 'g')

  return replace(content, regex, function (placeholder) {
    var mathes = placeholder.match('__' + name + '\\(([^\\(]+)\\)')
    var url = mathes[1]
    var stream = hexo.route.get(url)

    if (stream == null) {
      return Promise.reject(new Error('Can not find file: ' + url))
    }

    return loadFileContent(stream)
      .then(function (buffer) {
        var cached = cache.getCache(url, type)
        if (cached) { return cached }

        return generate(url, buffer, config[type])
      })
      .then(function (data) {
        cache.saveCache(url, type, data)
        return serialize(data)
      })
  })
}

function processHtmlFile(hexo, initialContent, config) {
  return Promise.reduce(Object.keys(types), function(content, type) {
    return processType(hexo, content, type, config)
  }, initialContent)
}

function getTypeName(type) {
  return type.toUpperCase()
}

function getConfig(hexo) {
  var config = hexo.config
  var theme = Object.assign({}, config, hexo.theme.config, config.theme_config)

  return Object.assign({
    cache: 'lqip-cache.json'
  }, theme.lqip)
}

exports.getConfig = getConfig

exports.afterClean = function () {
  var hexo = this
  var config = getConfig(hexo)
  var cache = getCache(config)

  return cache.clean()
}

exports.afterGenerate = function () {
  var hexo = this
  var config = getConfig(hexo)

  var route = hexo.route
  var routes = route.list()
  var htmlFiles = routes.filter(isHtmlFile)

  return Promise.map(htmlFiles, function (filePath) {
    return loadFileContent(route.get(filePath)).then(function (buffer) {
      return route.set(filePath, function () {
        return processHtmlFile(hexo, buffer.toString(), config)
      })
    })
  })
}

exports.lqipFor = function lqipFor(path, opts) {
  var hexo = this
  var config = hexo.theme.lqip || {}
  var options = Object.assign({
    type: config.default_type || 'potrace',
  }, opts)

  var name = getTypeName(options.type)

  return '__' + name + '(' + path +')'
}
