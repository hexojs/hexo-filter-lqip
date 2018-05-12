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
      if (typeof cache[url] !== 'object') {
        return
      }

      return cache[url][type]
    },

    saveCache: function (url, type, value) {
      cache[url] = cache[url] || {}
      cache[url][type] = value
      fs.writeFileSync(tmpPath, JSON.stringify(cache))
    },
    clean: function () {
      fs.unlinkSync(tmpPath)
    }
  }
}
