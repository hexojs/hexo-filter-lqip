import test from 'ava'
import fs from 'fs'
import getSandbox from './support/sandbox'
import {process} from 'hexo-test-utils/core'
import {contentFor, mockConfig} from 'hexo-test-utils'

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

  const Post = ctx.model('Post');
  await Post.insert({source: 'foo', slug: 'foo', featured_image: 'sea.jpg'})

  await process(ctx)
  await contentFor(ctx, 'foo/index.html')

  t.true(fs.existsSync('cache.json'))

  await ctx.call('clean', {})

  t.false(fs.existsSync('cache.json'))
})
