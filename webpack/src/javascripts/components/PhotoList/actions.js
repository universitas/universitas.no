import fetch from 'isomorphic-fetch'
import { addImage } from '../../containers/actions'
import { debounce } from 'lodash'
const DEBOUNCE_TIMEOUT = 500 // wait n ms before calling api
// import * as Cookies from 'js-cookie'

export const SEARCH_CHANGED = 'SEARCH_CHANGED'
export const searchChanged = text => ({
  type: SEARCH_CHANGED,
  payload: { text },
})

export const TOGGLE_IMAGE_TYPE = 'TOGGLE_IMAGE_TYPE'
export const toggleImageType = option => ({
  type: TOGGLE_IMAGE_TYPE,
  payload: { option },
})

export const FETCHED_IMAGES = 'FETCHED_IMAGES'
export const fetchedImages = data => ({
  type: FETCHED_IMAGES,
  payload: data,
})
export const FETCHING_IMAGES = 'FETCHING_IMAGES'
export const fetchingImages = url => ({
  type: FETCHING_IMAGES,
  payload: { url },
})
export const CLEAR_SEARCH = 'CLEAR_SEARCH'
export const clearSearch = () => ({
  type: CLEAR_SEARCH,
  payload: {},
})

export const searchAction = text => (dispatch, getState) => {
  // update search in store and queue api call to wikipedia
  dispatch(searchChanged(text))
  // debounced api call
  debouncedDoSearch(dispatch, { search: text, limit: 100 })
}

export const nextAction = () => (dispatch, getState) => {
  const url = getState().searchField.next
  fetchImages(dispatch, url)
}

export const refreshAction = () => (dispatch, getState) => {
  const url = getState().searchField.url
  fetchImages(dispatch, url)
}

export const prevAction = () => (dispatch, getState) => {
  const url = getState().searchField.previous
  fetchImages(dispatch, url)
}
export const fetchAction = () => (dispatch, getState) => {
  const url = buildUrl()
  fetchImages(dispatch, url)
}

const doSearch = (dispatch, attrs = {}) => {
  if (attrs.search === '') {
    dispatch(clearSearch())
    return
  }
  const url = buildUrl(attrs)
  fetchImages(dispatch, url)
}

const fetchImages = (dispatch, url) => {
  dispatch(fetchingImages(url))
  fetch(url, { credentials: 'same-origin' })
    .then(response => response.json())
    .then(data => {
      data.results.forEach(img => dispatch(addImage(img)))
      dispatch(fetchedImages(makePayload(data)))
    })
    .catch(console.error)
}

const debouncedDoSearch = debounce(doSearch, DEBOUNCE_TIMEOUT, {
  maxWait: DEBOUNCE_TIMEOUT * 2,
})

const makePayload = ({ results, ...data }) => ({
  images: results.map(r => r.id),
  ...data,
})

const buildUrl = (attrs = {}) => {
  const queryString = Object.entries(attrs)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return `/api/images/?${queryString}`
}
