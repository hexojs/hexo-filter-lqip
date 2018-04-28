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
  await Post.insert({source: 'foo', slug: 'foo'})
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
  await Post.insert({source: 'foo', slug: 'foo'})
  await process(ctx)

  const content = await contentFor(ctx, 'foo/index.html')
  t.snapshot(content.toString())
})
