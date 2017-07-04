import R from 'ramda'
import fetch from 'isomorphic-fetch'
import cuid from 'cuid'
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

export const apiFetch = (dispatch, url, head, body = null) => {
  const payload = R.mergeDeepRight(headBase, { ...head })
  if (body) payload.body = body
  const req = { url, cuid: cuid() }
  dispatch(fetching(req))
  return fetch(url, payload)
    .then(response => response.json())
    .then(dispatch(success(req)))
    .catch(error => {
      dispatch(failed(req, error))
      throw error
    })
}

export const apiList = model => dispatch => {
  const url = `${BASE_URL}/${model}/`
  return apiFetch(dispatch, url)
}

export const apiGet = model => id => dispatch => {
  const url = `${BASE_URL}/${model}/${id}/`
  return apiFetch(dispatch, url)
}

export const apiPatch = model => (id, data) => dispatch => {
  const url = `${BASE_URL}/${model}/${id}/`
  const head = {
    method: 'PATCH',
    credentials: 'include',
    // headers: {
    //   'Content-Type': 'application/json',
    //   'X-CSRFToken': Cookies.get('csrftoken'),
    // },
  }
  const body = JSON.stringify(data)
  return apiFetch(dispatch, url, head, body)
}

export const searchUrl = model => (attrs = {}) => {
  const queryString = Object.entries(attrs)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return `${BASE_URL}/${model}/?${queryString}`
}
