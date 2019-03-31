import test from 'ava'
import {gen, sampleOne} from 'testcheck'
import {base64Encode, base64Decode} from '../lqip/utils'

test('base64Encode', t => {
  const encoded = base64Encode('/path/to/file.jpg')

  t.is(encoded.includes('/'), false)
  t.is(encoded.includes('.'), false)
})

test('base64Decode', t => {
  const encoded = base64Encode('/path/to/file.jpg')

  t.is(base64Decode(encoded), '/path/to/file.jpg')
})

test('base64 - generative', t => {
  for (let i = 0; i < 10000; i++) {
    const subject = sampleOne(gen.string)
    t.is(base64Decode(base64Encode(subject)), subject)
  }
})
