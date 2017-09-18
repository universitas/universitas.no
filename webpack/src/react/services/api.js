import fetch from 'isomorphic-fetch'
import * as Cookies from 'js-cookie'

const BASE_URL = '/api'

// where the magic happens
export const apiFetch = (url, head, body = null) => {
  const request = initializeRequest(head)
  if (body) {
    R.type(body) == 'String'
      ? (request.body = body)
      : (request.body = JSON.stringify(body))
  }
  return fetch(url, request)
    .then(res =>
      res
        .json()
        .then(data => ({ HTTPstatus: res.status, url, ...data }))
        .then(data => (res.ok ? { response: data } : { error: data }))
    )
    .catch(error => ({ error }))
}

export const initializeRequest = (data = {}) =>
  R.mergeDeepRight(
    {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken') || '',
      },
    },
    data
  )

export const apiLogin = ({ username, password }) =>
  apiFetch(
    `${BASE_URL}/rest-auth/login/`,
    { method: 'POST' },
    { username, password }
  )

export const apiLogout = () =>
  apiFetch(`${BASE_URL}/rest-auth/logout/`, { method: 'POST' })

export const apiUser = () =>
  apiFetch(`${BASE_URL}/rest-auth/user/`, { method: 'GET' })

export const apiList = R.curry((model, attrs) => {
  const query = queryString(attrs)
  const url = query ? `${BASE_URL}/${model}/?${query}` : `${BASE_URL}/${model}/`
  return apiFetch(url)
})

export const apiGet = R.curry((model, id) => {
  return apiFetch(`${BASE_URL}/${model}/${id}/`)
})

export const apiPatch = R.curry((model, id, data) => {
  const url = `${BASE_URL}/${model}/${id}/`
  const head = { method: 'PATCH' }
  return apiFetch(url, head, data)
})

export const apiPost = R.curry((model, data) => {
  const url = `${BASE_URL}/${model}/`
  const head = { method: 'POST' }
  return apiFetch(url, head, data)
})

// helpers
const paramPairs = (value, key, _) =>
  R.type(value) == 'Array'
    ? `${key}=${value.map(cleanValues).join(',')}`
    : `${key}=${cleanValues(value)}`

const cleanValues = R.pipe(String, R.replace(/\s+/g, ' '), encodeURIComponent)

const isEmpty = R.contains(R.__, [{}, undefined, null, [], ''])

export const queryString = R.pipe(
  R.reject(isEmpty),
  R.mapObjIndexed(paramPairs),
  R.values,
  R.join('&')
)
export const searchUrl = R.curryN(2, (model, attrs = {}) => {
  const query = queryString(attrs)
  return query ? `${BASE_URL}/${model}/?${query}` : `${BASE_URL}/${model}/`
})
