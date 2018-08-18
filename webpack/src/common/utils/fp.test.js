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

test('without and union', () => {
  expect(fp.without(1, [1, 2, 3])).toEqual([2, 3])
  expect(fp.union(1, [1, 2, 3])).toEqual([1, 2, 3])
  expect(fp.union(1, [2, 3])).toEqual([1, 2, 3])
})

test('partial apply of curried functions', () => {
  const spec = {
    a: (a, b) => a + b,
    b: R.curry((a, b) => a + b),
    c: R.uncurryN(2, a => b => a + b),
  }
  expect(fp.partialMap(spec, 100).a(1)).toBe(101)
  expect(fp.partialMap(spec, [1]).b(4)).toBe(5)
  expect(fp.partialMap(spec, [100, 200]).c).toBe(300)
})
