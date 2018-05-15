import test from 'ava'
import fs from 'fs'
import getSandbox from './support/sandbox'
import {process} from 'hexo-test-utils/core'
import {contentFor, mockConfig, getHelper} from 'hexo-test-utils'

const sandbox = getSandbox()

const mockThemeConfig = (ctx, name, value) => {
  var cfg = {}
  cfg[name] = value
  mockConfig(ctx, 'theme_config', cfg)
}

test('uses theme config', async t => {
  const ctx = await sandbox('potrace')

  const Post = ctx.model('Post');
  await Post.insert({source: 'foo', slug: 'foo', featured_image: 'sea.jpg'})
  await process(ctx)

  const content = await contentFor(ctx, 'foo/index.html')
  t.snapshot(content.toString())
})

test('caches placeholders', async t => {
  const ctx = await sandbox('potrace')
  mockThemeConfig(ctx, 'lqip', {
    cache: 'cache.json'
  })

  const Post = ctx.model('Post')
  await Post.insert({source: 'foo', slug: 'foo', featured_image: 'sea.jpg'})

  await process(ctx)
  await contentFor(ctx, 'foo/index.html')

  t.true(fs.existsSync('cache.json'))

  await ctx.call('clean', {})

  t.false(fs.existsSync('cache.json'))
})

test('allows to set filter priority', async t => {
  const ctx = await sandbox('potrace')
  mockThemeConfig(ctx, 'lqip', {
    cache: false,
    priority: 9
  })

  const Post = ctx.model('Post')
  await Post.insert({source: 'foo', slug: 'foo', featured_image: 'sea.jpg'})

  ctx.extend.filter.register('after_generate', function () {
    const lqip_for = getHelper(this, 'lqip_for')
    ctx.route.set('foo/index2.html', lqip_for('sea.jpg'))
  }, 10)

  await process(ctx)

  const content = await contentFor(ctx, 'foo/index2.html')

  const lqip_for = getHelper(ctx, 'lqip_for')
  t.is(content.toString(), lqip_for('sea.jpg'))
})
