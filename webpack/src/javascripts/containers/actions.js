import fetch from 'isomorphic-fetch'
import * as Cookies from 'js-cookie'

export const SELECT_IMAGE = 'SELECT_IMAGE'
export const selectImage = (id) => ({
  type: SELECT_IMAGE,
  payload: { id },
})

export const REQUEST_IMAGE_FILE = 'REQUEST_IMAGE_FILE'
export const requestImageFile = (id) => ({
  type: REQUEST_IMAGE_FILE,
  payload: { id },
})


export const ADD_IMAGE = 'ADD_IMAGE'
export const addImage = (id, json) => ({
  type: ADD_IMAGE,
  payload: {
    id,
    receivedAt: Date.now(),
    ...json,
  },
})
export const IMAGE_FILE_PATCHED = 'IMAGE_FILE_PATCHED'
export const imageFilePatched = (id, status_code) => ({
  type: IMAGE_FILE_PATCHED,
  payload: { id, status_code },
})


export const fetchImageFile = id => dispatch => {
  // update the app state to indicate that the API call is starting
  dispatch(requestImageFile(id))

  return fetch(`/api/images/${id}/`, { credentials: 'same-origin' })
    .then(response => response.json())
    .then(transformApidata2State)
    .then(data => dispatch(addImage(id, data)))
  // add error handling
}

export const patchImage = (id, data) => dispatch => {
  // update the app state to indicate that the API call is starting
  const patch_data = transformImageData2Api(data)
  const patch_request = {
    method: 'patch',
    credentials: 'include',
    body: JSON.stringify(patch_data),
    headers: {
      'Content-Type': 'application/json',
      'X_CSRFTOKEN': Cookies.get('csrftoken'),
    },
  }

  return fetch(`/api/images/${id}/`, patch_request)
    .then(response => dispatch(imageFilePatched(id, response.statusText)))
  // add error handling
}

const transformApidata2State = (data) => {
  const {x, y, top, bottom, left, right} = data.crop_box
  return {
    src: data.source_file,
    size: [data.full_width, data.full_height],
    crop: {
      h: [left, x, right],
      v: [top, y, bottom],
    },
  }
}

const transformImageData2Api = (data) => {
  const [left, x, right] = data.crop.h
  const [top, y, bottom] = data.crop.v
  const crop_box = {x, y, top, bottom, left, right}
  return { crop_box }
}
