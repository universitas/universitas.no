import { httpOptions, searchUrl } from './api'

test('build http fetch init and headers', () => {
  expect(httpOptions()).toEqual({
    method: 'GET',
    credentials: 'same-origin',
    headers: { 'X-CSRFToken': 'NO-CSRF-COOKIE' },
  })
  expect(httpOptions({ method: 'POST' }, 'hello world')).toMatchObject({
    method: 'POST',
    body: 'hello world',
  })
  expect(httpOptions(null, { data: 'hello world' })).toMatchObject({
    method: 'GET',
    body: '{"data":"hello world"}', // json stringified
    headers: { 'Content-Type': 'application/json' }, // correct header
  })
  const form = new FormData()
  form.append('foo', 'bar')
  expect(httpOptions({ method: 'POST' }, form)).toMatchObject({
    method: 'POST',
    body: form,
  })
})

test('search url create', () => {
  expect(searchUrl('stories')({ search: 'hello' })).toBe(
    '/api/stories/?search=hello',
  )
  expect(searchUrl('issues')({ search: '' })).toBe('/api/issues/')
})
