var fs = require('fs')
var tmp
try {
  tmp = fs.readFileSync('tmp.json').toString()
} catch (ex) {
  tmp = '{}'
}

var cache = JSON.parse(tmp)

module.exports = {
  getCache: function (url, type) {
    return cache[url]
  },

  saveCache: function (url, type, value) {
    cache[url] = value
    fs.writeFileSync('tmp.json', JSON.stringify(cache))
  }
}
