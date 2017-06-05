import fetch from 'isomorphic-fetch'
import * as Cookies from 'js-cookie'

export const SELECT_IMAGE = 'SELECT_IMAGE'
export const selectImage = id => ({
  type: SELECT_IMAGE,
  payload: { id },
})

export const REQUEST_IMAGE_FILE = 'REQUEST_IMAGE_FILE'
export const requestImageFile = id => ({
  type: REQUEST_IMAGE_FILE,
  payload: { id },
})

export const ADD_IMAGE = 'ADD_IMAGE'
export const addImage = json => ({
  type: ADD_IMAGE,
  payload: {
    ...json,
    receivedAt: Date.now(),
  },
})

export const IMAGE_FILE_PATCHED = 'IMAGE_FILE_PATCHED'
export const imageFilePatched = json => ({
  type: IMAGE_FILE_PATCHED,
  payload: {
    ...json,
    receivedAt: Date.now(),
  },
})

export const fetchImageFile = id => dispatch => {
  // update the app state to indicate that the API call is starting
  dispatch(requestImageFile(id))

  return fetch(`/api/images/${id}/`, { credentials: 'same-origin' })
    .then(response => response.json())
    .then(data => dispatch(addImage(data)))
    .catch(console.error)
  // add error handling
}

export const patchImage = (id, data) => dispatch => {
  // update the app state to indicate that the API call is starting
  const patch_data = transformImageData2Api(data)
  const patch_request = {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify(patch_data),
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  }

  return fetch(`/api/images/${id}/`, patch_request)
    .then(response => response.json())
    .then(({ crop_box, ...data }) => data)
    .then(data => dispatch(imageFilePatched(data)))
    .catch(console.error)
  // add error handling
}

const transformImageData2Api = ({ crop_box, cropping_method }) => ({
  crop_box,
  cropping_method,
})
