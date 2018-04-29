import test from 'ava'
import getSandbox from './support/sandbox'
import {process} from 'hexo-test-utils/core'
import {contentFor, mockConfig} from 'hexo-test-utils'

const sandbox = getSandbox()

test('renders potrace placeholder', async t => {
  const ctx = await sandbox('potrace')
  mockConfig(ctx, 'lqip', {
    cache: false,
    potrace: {
      color: 'red'
    }
  })

  const Post = ctx.model('Post');
  await Post.insert({source: 'foo', slug: 'foo', featured_image: 'sea.jpg'})
  await process(ctx)

  const content = await contentFor(ctx, 'foo/index.html')
  t.snapshot(content.toString())
})

test('allows to set potrace canvas size', async t => {
  const ctx = await sandbox('potrace')
  mockConfig(ctx, 'lqip', {
    cache: false,
    potrace: {
      canvas_size: {
        width: 10
      }
    }
  })

  const Post = ctx.model('Post');
  await Post.insert({source: 'foo', slug: 'foo', featured_image: 'sea.jpg'})
  await process(ctx)

  const content = await contentFor(ctx, 'foo/index.html')
  t.snapshot(content.toString())
})

test('handles missing files', async t => {
  const ctx = await sandbox('potrace')
  mockConfig(ctx, 'lqip', {
    cache: false
  })

  const Post = ctx.model('Post');
  await Post.insert({source: 'foo', slug: 'foo', featured_image: 'missing-file.jpg'})

  await process(ctx)
  const error = await t.throws(contentFor(ctx, 'foo/index.html'))
  t.is(error.message, 'Can not find file: missing-file.jpg')
})
