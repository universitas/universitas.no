import fetch from 'isomorphic-fetch'

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


// async action dispatcher
export const fetchImageFile = id => dispatch => {
  // update the app state to indicate that the API call is starting
  dispatch(requestImageFile(id))

  return fetch(`/api/images/${id}/`, { credentials: 'same-origin' })
    .then(response => response.json())
    .then(transformData)
    .then(data => dispatch(addImage(id, data)))
  // add error handling
}

const transformData = (data) => {
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
