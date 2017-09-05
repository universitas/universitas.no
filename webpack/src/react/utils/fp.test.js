import * as fp from './fp'

test('toggle list item', () => {
  expect(fp.arrayToggle('a', ['a', 'b', 'c'])).toEqual(['b', 'c'])
  expect(fp.arrayToggle('c', ['a', 'b'])).toEqual(['a', 'b', 'c'])
  expect(fp.arrayToggle(1, [1])).toEqual([])
  expect(fp.arrayToggle('a', [])).toEqual(['a'])
  expect(fp.arrayToggle(1, [1])).toEqual([])
  expect(fp.arrayToggle(1, [2])).toEqual([1, 2])
})

test('toggle object item', () => {
  const toggle = fp.objectToggle('a', 1)
  expect(toggle({ a: 1, b: 2 })).toEqual({ b: 2 })
  expect(toggle({ a: 2, b: 1 })).toEqual({ a: 1, b: 1 })
  expect(toggle({ b: 1 })).toEqual({ a: 1, b: 1 })
})

test('toggle combined item', () => {
  const toggle = fp.combinedToggle('a', 1)
  expect(toggle({ a: 1, b: 2 })).toEqual({ b: 2 })
  expect(toggle({ a: 2, b: 1 })).toEqual({ a: 1, b: 1 })
  expect(toggle({ b: 1 })).toEqual({ a: 1, b: 1 })
  expect(toggle({ a: [1] })).toEqual({ a: [] })
  expect(toggle({ a: [2] })).toEqual({ a: [1, 2] })
})
