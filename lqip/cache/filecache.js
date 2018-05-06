var fs = require('fs')

module.exports = function (tmpPath) {
  var tmp
  try {
    tmp = fs.readFileSync(tmpPath).toString()
  } catch (ex) {
    tmp = '{}'
  }

  var cache = JSON.parse(tmp)

  return {
    getCache: function (url, type) {
      return cache[url]
    },

    saveCache: function (url, type, value) {
      cache[url] = value
      fs.writeFileSync(tmpPath, JSON.stringify(cache))
    },
    clean: function () {
      fs.unlinkSync(tmpPath)
    }
  }
}
