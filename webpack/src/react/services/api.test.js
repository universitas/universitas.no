import { searchUrl, queryString, initializeRequest } from './api'

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

test('default request headers', () => {
  expect(initializeRequest({ method: 'POST' })).toMatchObject({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
})

test('search url create', () => {
  expect(searchUrl('stories')({ search: 'hello' })).toBe(
    '/api/stories/?search=hello'
  )
  expect(searchUrl('issues')({ search: '' })).toBe('/api/issues/')
})
