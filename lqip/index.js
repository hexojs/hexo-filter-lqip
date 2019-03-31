var Promise = require('bluebird')

var Stats = require('./stats').Stats
var getCache = require('./cache')
var isHtmlFile = require('./utils').isHtmlFile
var getTypeName = require('./utils').getTypeName
var loadFileContent = require('./utils').loadFileContent
var base64Encode = require('./utils').base64Encode
var processHtmlFile = require('./process').processHtmlFile

var stats = new Stats()

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
        return processHtmlFile({hexo: hexo, content: buffer.toString(), config: config, stats: stats})
      })
    })
  })
}

exports.beforeExit = function () {
  var hexo = this

  var messages = []
  if (stats.generated) {
    messages.push(stats.generated + ' files generated')
  }

  if (stats.cached) {
    messages.push(stats.cached + ' files from cache')
  }

  if (messages.length > 0) {
    hexo.log.info('[LQIP] processing summary: ' + messages.join(', '))
  }
}

exports.lqipFor = function lqipFor(path, opts) {
  var hexo = this
  var config = hexo.theme.lqip || {}
  var options = Object.assign({
    type: config.default_type || 'potrace',
  }, opts)

  var name = getTypeName(options.type)
  return '__' + name + '(' + base64Encode(path) +')'
}
