import fetch from 'isomorphic-fetch'
import { addImage } from '../../containers/actions'
// import * as Cookies from 'js-cookie'

export const UPDATE_SEARCH = 'UPDATE_SEARCH'
export const updateSearch = (text) => ({
  type: UPDATE_SEARCH,
  payload: {text},
})

export const CLEAR_SEARCH = 'CLEAR_SEARCH'
export const clearSearch = () => ({
  type: CLEAR_SEARCH,
  payload: {  },
})

export const TOGGLE_IMAGE_TYPE = 'TOGGLE_IMAGE_TYPE'
export const toggleImageType = (option) => ({
  type: TOGGLE_IMAGE_TYPE,
  payload: { option },
})

export const FETCHED_IMAGES = 'FETCHED_IMAGES'
export const fetchedImages = (image_ids) => ({
  type: FETCHED_IMAGES,
  payload: { image_ids },
})

export const fetchImages = (queries) => dispatch => {
  // update the app state to indicate that the API call is starting
  const query = queries.length > 0 ? '?' + queries.join('&') : ''

  return fetch(`/api/images/${query}`, { credentials: 'same-origin' })
    .then(response => response.json())
    .then(data => {
      data.results.forEach(img => dispatch(addImage(img)))
      dispatch(fetchedImages(data.results.map(r => r.id)))
    })
  // add error handling
}
