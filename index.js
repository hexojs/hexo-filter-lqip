var lqip = require('./lqip')
var config = lqip.getConfig(hexo)

hexo.extend.filter.register('after_generate', lqip.afterGenerate, config.priority);
hexo.extend.filter.register('after_clean', lqip.afterClean);
hexo.extend.filter.register('before_exit', lqip.beforeExit);
hexo.extend.helper.register('lqip_for', lqip.lqipFor)
