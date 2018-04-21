import {
  parseQuery,
  queryString,
  paramPairs,
  parseParam,
  cleanValues,
  isEmpty,
} from 'utils/urls'

test('object to url query parameters', () => {
  expect(
    queryString({
      names_in: [],
      search: 'hello world!',
      limit: 20,
    })
  ).toBe('search=hello%20world!&limit=20')

  expect(
    queryString({
      data_in: [1, 7, 3, 4],
      foo: null,
      search: '',
      name: 'Håken',
    })
  ).toBe('data_in=1,7,3,4&name=H%C3%A5ken')
})

test('isEmpty', () => {
  const empty = [[], {}, '', null, undefined]
  const nonempty = [[[]], { a: [] }, 'a', true, false, 0, 1]
  empty.map(value => expect(isEmpty(value)).toBe(true))
  nonempty.map(value => expect(isEmpty(value)).toBe(false))
})

test('cleanValues', () => {
  R.map(([val, res]) => expect(cleanValues(val)).toEqual(res), [
    [0, '0'],
    [null, 'null'],
    ['  ', ''],
    ['&', '%26'],
    ['   &\n%\t', '%26%20%25'],
  ])
})

test('paramPairs', () => {
  expect(paramPairs('a', 'b')).toEqual('a=b')
  expect(paramPairs('a', [1, 2, 3])).toEqual('a=1,2,3')
})

test('parseParam', () => {
  expect(parseParam('1')).toEqual(1)
  expect(parseParam('aaa')).toEqual('aaa')
  expect(parseParam('a,b,c')).toEqual(['a', 'b', 'c'])
  expect(parseParam('1,2,c')).toEqual([1, 2, 'c'])
})

test('parseQuery', () => {
  expect(parseQuery('')).toEqual({})
  expect(parseQuery('http://foobar.com')).toEqual({})
  expect(parseQuery('foo=1')).toEqual({ foo: 1 })
  expect(
    parseQuery('http://localhost:8000/api/?snafoo=1,2,7&foobar=baz')
  ).toEqual({
    snafoo: [1, 2, 7],
    foobar: 'baz',
  })
})
