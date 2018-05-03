var lqip = require('./lqip')

hexo.extend.filter.register('after_generate', lqip.afterGenerate);
hexo.extend.helper.register('lqip_for', lqip.lqipFor)
