import { queryString, searchUrl } from './api'

test('query params', () => {
  const attrs = { search: 'hello world!', limit: 20 }
  const urlTail = 'search=hello%20world!&limit=20'
  expect(queryString(attrs)).toMatch(urlTail)
  const url = searchUrl('people')(attrs)
  expect(url).toMatch('/api/people/?' + urlTail)
})
