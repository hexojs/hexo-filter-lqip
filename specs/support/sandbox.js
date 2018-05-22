const Hexo = require('hexo')
const {createSandbox} = require('hexo-test-utils')
const path = require('path')

module.exports = function getSandbox() {
  return createSandbox(Hexo, {
    fixture_folder: path.join(__dirname, '..','fixtures'),
    plugins: [
      require.resolve('hexo-renderer-ejs'),
      require.resolve('../../index.js')
    ]
  })
}
