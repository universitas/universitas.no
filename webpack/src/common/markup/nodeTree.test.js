import { results as stories } from './fixture.apidata.json'
import {
  getChildren,
  getPlaces,
  getLink,
  getPlaceChildren,
  buildNodeTree,
} from './nodeTree'

test('getChildren', () => {
  const expected = [
    { type: 'image' },
    { type: 'image' },
    { type: 'image' },
    { type: 'aside' },
  ]
  expect(getChildren(stories[1])).toMatchObject(expected)
})

test('getPlaces', () =>
  expect(getPlaces(stories[0])).toEqual([
    'image-2',
    'image-1',
    'head',
    'quote-4',
    'quote-3',
    'quote-2',
    'quote-1',
    'box-1',
  ]))

test('getLink', () =>
  expect(getLink({ name: '1' })(stories[2])).toMatchObject({ name: '1' }))

test('getPlaceChildren', () =>
  expect(getPlaceChildren({ name: 'head' })(stories[0])).toMatchObject([
    { placement: 'head' },
  ]))

describe('buildNodeTree', () => {
  const story = stories[0]
  const parsed = buildNodeTree(story)
  test('parses without error', () => expect(parsed).toEqual(expect.any(Object)))
  test('parses and builds', () =>
    expect(R.symmetricDifference(R.keys(story), R.keys(parsed))).toEqual([
      'parseTree',
      'nodeTree',
    ]))
  test('parse tree length', () => {
    expect([parsed.parseTree.length, parsed.nodeTree.length]).toEqual([66, 66])
  })
})
