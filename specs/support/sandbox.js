const Hexo = require('hexo')
const {createSandbox} = require('hexo-test-utils')
const path = require('path')

module.exports = function getSandbox() {
  return createSandbox(Hexo, {
    fixture_folder: path.join(__dirname, '..','fixtures'),
    plugins: [
      path.join(__dirname, '..', '..', 'node_modules', 'hexo-renderer-ejs', 'index.js'),
      path.join(__dirname, '..', '..', 'index.js')
    ]
  })
}
