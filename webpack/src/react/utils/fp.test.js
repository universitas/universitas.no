import * as fp from './fp'

test('toggle list item', () => {
  expect(fp.arrayToggle('a', ['a', 'b', 'c'])).toEqual(['b', 'c'])
  expect(fp.arrayToggle('c', ['a', 'b'])).toEqual(['a', 'b', 'c'])
})

test('toggle object item', () => {
  const toggle = fp.objectToggle('a', 1)
  expect(toggle({ a: 1, b: 2 })).toEqual({ b: 2 })
  expect(toggle({ a: 2, b: 1 })).toEqual({ a: 1, b: 1 })
  expect(toggle({ b: 1 })).toEqual({ a: 1, b: 1 })
})
