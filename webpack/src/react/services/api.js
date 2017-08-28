import R from 'ramda'
import fetch from 'isomorphic-fetch'
// import cuid from 'cuid'
import * as Cookies from 'js-cookie'

const BASE_URL = '/api'

export const FETCHING = 'api/FETCHING'
export const SUCCESS = 'api/SUCCESS'
export const FAILED = 'api/FAILED'

// action creators
const fetching = request => ({
  type: FETCHING,
  payload: { request },
})
const failed = (request, error) => ({
  type: FAILED,
  payload: { request, error },
})
const success = request => ({
  type: SUCCESS,
  payload: { request },
})

const headBase = {
  method: 'GET',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': Cookies.get('csrftoken'),
  },
}

export const apiFetch = (url, head = {}, body = null) => {
  const init = R.mergeDeepRight(headBase, { ...head })
  if (body) init.body = body
  return fetch(url, init)
    .then(response => response.json())
    .then(response => ({ response }))
    .catch(error => ({ error }))
}

export const apiList = (model, attrs = {}) => {
  const query = queryString(attrs)
  return query
    ? apiFetch(`${BASE_URL}/${model}/?${query}`)
    : apiFetch(`${BASE_URL}/${model}/`)
}

export const apiGet = model => id => {
  return apiFetch(`${BASE_URL}/${model}/${id}/`)
}

export const apiPatch = model => (id, data) => {
  const url = `${BASE_URL}/${model}/${id}/`
  const head = { method: 'PATCH' }
  const body = JSON.stringify(data)
  return apiFetch(url, head, body)
}

// helpers
const paramPairs = (value, key, _) =>
  R.type(value) == 'Array'
    ? `${key}__in=${value.join(',')}`
    : `${key}=${cleanValues(value)}`

const cleanValues = R.pipe(String, R.replace(/\s+/g, ' '), encodeURIComponent)

export const queryString = R.pipe(
  R.mapObjIndexed(paramPairs),
  // R.map(cleanValues),
  // R.mapObjIndexed(paramPairs),
  R.values,
  R.join('&')
)

export const searchUrl = model => (attrs = {}) => {
  return `${BASE_URL}/${model}/?${queryString(attrs)}`
}
