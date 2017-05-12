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
export const fetchedImages = image_ids => ({
  type: FETCHED_IMAGES,
  payload: { image_ids },
})

export const clearSearch = () => ({
  type: SEARCH_CHANGED,
  payload: { text: '' },
})

export const searchAction = text => (dispatch, getState) => {
  // update search in store and queue api call to wikipedia
  dispatch(searchChanged(text))
  // debounced api call
  debouncedFetchImages(dispatch, { search: text, limit: 100 })
}

export const fetchAction = () => dispatch => fetchImages(dispatch)

const fetchImages = (dispatch, attrs = { limit: 100 }) => {
  // update the app state to indicate that the API call is starting
  if (attrs.search === '') {
    dispatch(fetchedImages([]))
    return
  }
  const url = buildUrl(attrs)
  fetch(url, { credentials: 'same-origin' })
    .then(response => response.json())
    .then(data => {
      data.results.forEach(img => dispatch(addImage(img)))
      dispatch(fetchedImages(data.results.map(r => r.id)))
    })
    .catch(console.error)
  //add error handling
}

const debouncedFetchImages = debounce(fetchImages, DEBOUNCE_TIMEOUT, {
  maxWait: DEBOUNCE_TIMEOUT * 2,
})

const buildUrl = (attrs = {}) => {
  const queryString = Object.entries(attrs)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  return `/api/images/?${queryString}`
}
