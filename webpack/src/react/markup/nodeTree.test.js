import { results as stories } from './apidata.json'
import {
  getChildren,
  getPlaces,
  getLink,
  getPlaceChildren,
  buildNodeTree,
} from './nodeTree'

test('getChildren', () => {
  const expected = [{ type: 'image' }, { type: 'image' }, { type: 'aside' }]
  expect(getChildren(stories[5])).toMatchObject(expected)
})

test('getPlaces', () => expect(getPlaces(stories[0])).toEqual(['head']))

test('getLink', () =>
  expect(getLink({ ref: '1' })(stories[0])).toMatchObject({ number: 1 }))

test('getPlaceChildren', () =>
  expect(getPlaceChildren({ name: 'head' })(stories[0])).toMatchObject([
    { placement: 'head' },
  ]))

test('buildNodeTree', () => expect(buildNodeTree(stories[0])).toMatchObject({}))
