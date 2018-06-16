import { makeParser, tags } from './tags'

test('makeParser', () => {
  const parser = makeParser({ pattern: /he/ }, 'HEI')
  expect(parser('hei')).toMatchObject({
    index: 2,
    content: 'he',
    type: 'HEI',
  })
  expect(parser('ei')).toEqual(null)
})

test('tags', () => {
  expect(tags.paragraph).toMatchObject({
    type: 'paragraph',
    leaf: false,
    order: 100,
  })
})
