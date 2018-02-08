import fetch from 'isomorphic-fetch'
import * as Cookies from 'js-cookie'

// base url for the api
const BASE_URL = '/api'

// Set content type header
const contentType = R.assocPath(['headers', 'Content-Type'])

const mergeDeepAll = R.reduce(R.mergeDeepRight, {})

// Create a merge-able init mapping with body data and content type header
// jsonifyBody :: Any -> Object
const jsonifyBody = R.cond([
  [R.isNil, R.always({})],
  [R.is(String), R.pipe(R.objOf('body'), contentType('text/plain'))],
  [
    R.T,
    R.pipe(JSON.stringify, R.objOf('body'), contentType('application/json')),
  ],
])

// Merge headers and body to build an init object for fetch spec
export const initializeRequest = (head, body) =>
  mergeDeepAll([
    {
      method: 'GET',
      credentials: 'same-origin',
      headers: { 'X-CSRFToken': Cookies.get('csrftoken') || 'NO-CSRF-COOKIE' },
    },
    R.defaultTo({}, head),
    jsonifyBody(body),
  ])

// Perform fetch return promise containing an object with either an
// `error` or `response` property. {error: Object} | {response: Object}
// apiFetch :: (String, Object, Any) -> Promise[Object]
export const apiFetch = (url, head = {}, body = null) => {
  const init = initializeRequest(head, body)
  return fetch(url, init)
    .then(response =>
      response
        .json()
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

// Get list data of `model` from django rest api
export const apiList = R.curry((model, attrs) => {
  const query = queryString(attrs)
  const url = query ? `${BASE_URL}/${model}/?${query}` : `${BASE_URL}/${model}/`
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

// paramPairs :: (String | Array, String, Object) -> { String : String }
export const paramPairs = (key, value) =>
  R.is(Array, value)
    ? `${key}=${value.map(cleanValues).join(',')}`
    : `${key}=${cleanValues(value)}`

// convert query data to url paramater string
// cleanValues :: Number|String -> String
export const cleanValues = R.pipe(
  String,
  R.trim,
  R.replace(/\s+/g, ' '),
  encodeURIComponent
)

// build "search" url for api model list view with query pareters.
// searchUrl :: String -> Object -> String
export const searchUrl = R.curryN(2, (model, attrs = {}) => {
  const query = queryString(attrs)
  return query ? `${BASE_URL}/${model}/?${query}` : `${BASE_URL}/${model}/`
})

// Emptiness test where the falsy values 0 and false are not empty
// but trythy values {} and [] are empty.
// isEmpty :: Any -> Boolean
export const isEmpty = R.contains(R.__, [{}, undefined, null, [], ''])

// flipify mapObjectIndexed
// ((k, v) -> A) -> Object[k, v] -> Array[A]
const mapObject = fn =>
  R.pipe(R.mapObjIndexed((val, key, _) => fn(key, val)), R.values)

// Build url safe querystring from object mapping.
// queryString :: Obj -> String
export const queryString = R.pipe(
  R.reject(isEmpty),
  mapObject(paramPairs),
  R.join('&')
)
