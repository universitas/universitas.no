import fetch from 'isomorphic-fetch'
import * as Cookies from 'js-cookie'
import { queryString } from 'utils/urls'

// base url for the api
const BASE_URL = '/api'

// Set content type header
const contentType = R.assocPath(['headers', 'Content-Type'])

// Create a merge-able init mapping with body data and content type header
// wrapBody :: Any -> Object
const wrapBody = R.cond([
  [R.isNil, R.always({})], // no body
  [R.is(String), R.objOf('body')], // plain string (content-type auto)
  [R.is(FormData), R.objOf('body')], // multipart form (content-type auto)
  [
    R.T, // anything else is converted to JSON
    R.pipe(JSON.stringify, R.objOf('body'), contentType('application/json')),
  ],
])

const mergeReduce = R.reduce(R.mergeDeepRight, {})
const getCookie = () => ({
  'X-CSRFToken': Cookies.get('csrftoken') || 'NO-CSRF-COOKIE',
})

// Merge headers and body to build an init object for fetch spec
export const httpOptions = (head, body) =>
  mergeReduce([
    {
      method: 'GET', // default method
      credentials: 'same-origin',
    },
    { headers: getCookie() },
    R.defaultTo({}, head),
    wrapBody(body),
  ])

// build "search" url for api model list view with query parameters.
// searchUrl :: String -> Object -> String
export const searchUrl = R.curryN(2, (model, params = {}) => {
  const query = queryString(params)
  return query ? `${BASE_URL}/${model}/?${query}` : `${BASE_URL}/${model}/`
})

// Perform fetch return promise containing an object with either an
// `error` or `response` property. {error: Object} | {response: Object}
// apiFetch :: (String, Object, Any) -> Promise[Object]
export const apiFetch = (url, head = {}, body = null) => {
  const init = httpOptions(head, body)
  return fetch(url, init)
    .then(response =>
      response
        .json() // api always should return json
        .catch(jsonError => {}) // ... except for DELETE
        .then(data => ({ HTTPstatus: response.status, url, ...data }))
        .then(data => (response.ok ? { response: data } : { error: data }))
    )
    .catch(error => ({ error })) // fetch error – not status code
}

// login user and set session cookie
export const apiLogin = ({ username, password }) =>
  apiFetch(
    `${BASE_URL}/rest-auth/login/`,
    { method: 'POST' },
    { username, password }
  )

// logout user (invalidates cookies)
export const apiLogout = () =>
  apiFetch(`${BASE_URL}/rest-auth/logout/`, { method: 'POST' })

// fetch user data if authenticated or errors with status 403
export const apiUser = () =>
  apiFetch(`${BASE_URL}/rest-auth/user/`, { method: 'GET' })

// generic action
const apiAction = R.curry((model, action, head, data, pk) =>
  apiFetch(`${BASE_URL}/${model}/${pk}/${action}/`, head, data)
)

// Push image file to desken
// :: pk -> Promise
export const pushImageFile = apiAction(
  'photos',
  'push_file',
  { method: 'POST' },
  null
)

// Get list data of `model` from django rest api
export const apiList = R.curry((model, params) => {
  const url = searchUrl(model, params)
  return apiFetch(url)
})

// Get model instance data from api
export const apiGet = R.curry((model, id) => {
  return apiFetch(`${BASE_URL}/${model}/${id}/`)
})

// Patch model instance data from api
export const apiPatch = R.curry((model, id, data) => {
  const url = `${BASE_URL}/${model}/${id}/`
  const head = { method: 'PATCH' }
  return apiFetch(url, head, data)
})

// Post new model instance to api
export const apiPost = R.curry((model, data) => {
  const url = `${BASE_URL}/${model}/`
  const head = { method: 'POST' }
  return apiFetch(url, head, data)
})

// Delete model instance in api
export const apiDelete = R.curry((model, id) => {
  const url = `${BASE_URL}/${model}/${id}/`
  return apiFetch(url, { method: 'DELETE' })
})
