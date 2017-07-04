import fetch from 'isomorphic-fetch'
import { addImage } from '../../containers/actions'
import { debounce } from 'lodash'
const DEBOUNCE_TIMEOUT = 500 // wait n ms before calling api
// import * as Cookies from 'js-cookie'

export const CLEAR_SEARCH = 'photolist/CLEAR_SEARCH'
export const FETCHING_IMAGES = 'photolist/FETCHING_IMAGES'
export const FETCHED_IMAGES = 'photolist/FETCHED_IMAGES'
export const TOGGLE_IMAGE_TYPE = 'photolist/TOGGLE_IMAGE_TYPE'
export const TOGGLE_THUMB_STYLE = 'photolist/TOGGLE_THUMB_STYLE'
export const SEARCH_CHANGED = 'photolist/SEARCH_CHANGED'

export const searchChanged = text => ({
  type: SEARCH_CHANGED,
  payload: { text },
})

export const toggleThumbStyle = () => ({
  type: TOGGLE_THUMB_STYLE,
  payload: {},
})

export const toggleImageType = option => ({
  type: TOGGLE_IMAGE_TYPE,
  payload: { option },
})

export const fetchedImages = data => ({
  type: FETCHED_IMAGES,
  payload: data,
})
export const fetchingImages = url => ({
  type: FETCHING_IMAGES,
  payload: { url },
})
export const clearSearch = () => ({
  type: CLEAR_SEARCH,
  payload: {},
})

export const searchAction = text => (dispatch, getState) => {
  // update search in store and queue api call to wikipedia
  dispatch(searchChanged(text))
  // debounced api call
  debouncedDoSearch(dispatch, { search: text })
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
  attrs.limit = 20
  const url = buildUrl(attrs)
  fetchImages(dispatch, url)
}

const fetchImages = (dispatch, url) => {
  dispatch(fetchingImages(url))
  fetch(url, { credentials: 'same-origin' })
    .then(response => {
      console.log(response)
      return response
    })
    .then(response => response.json())
    .then(data => {
      data.results.forEach(img => dispatch(addImage(img)))
      dispatch(fetchedImages(makePayload(data)))
    })
    .catch(console.error)
}

const debouncedDoSearch = debounce(doSearch, DEBOUNCE_TIMEOUT)

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
