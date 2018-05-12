import test from 'ava'
import getSandbox from './support/sandbox'
import {process} from 'hexo-test-utils/core'
import {contentFor, mockConfig} from 'hexo-test-utils'

const sandbox = getSandbox()

const mockThemeConfig = (ctx, name, value) => {
  var cfg = {}
  cfg[name] = value
  mockConfig(ctx, 'theme_config', cfg)
}

test('renders color placeholder', async t => {
  const ctx = await sandbox('color')
  mockThemeConfig(ctx, 'lqip', {
    cache: false
  })

  const Post = ctx.model('Post');
  await Post.insert({source: 'foo', slug: 'foo', featured_image: 'sea.jpg'})
  await process(ctx)

  const content = await contentFor(ctx, 'foo/index.html')
  t.is(content.toString(), 'linear-gradient(#eaccaa, #eaccaa)\n')
})

