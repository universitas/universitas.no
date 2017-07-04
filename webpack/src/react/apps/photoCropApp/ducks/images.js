import R from 'ramda'

// Action constants
export const ADD_IMAGE = 'images/ADD_IMAGE'
export const IMAGE_FILE_PATCHED = 'images/IMAGE_FILE_PATCHED'
export const REQUEST_IMAGE_FILE = 'images/REQUEST_IMAGE_FILE'
export const AUTOCROP_IMAGE = 'images/AUTOCROP_IMAGE'

// Selectors
export const getImage = (state, id) => state.images[id]

// Action creators
export const addImage = json => ({
  type: ADD_IMAGE,
  payload: {
    ...json,
    receivedAt: Date.now(),
  },
})

export const autocropImage = id => ({
  type: AUTOCROP_IMAGE,
  payload: { id },
})

export const imageFilePatched = json => ({
  type: IMAGE_FILE_PATCHED,
  payload: {
    ...json,
    receivedAt: Date.now(),
  },
})

const requestImageFile = id => ({
  type: REQUEST_IMAGE_FILE,
  payload: { id },
})

// utils

const transformImageData2Api = ({ crop_box, cropping_method }) => ({
  crop_box,
  cropping_method,
})

// reducers

const image = (state = {}, action) => {
  switch (action.type) {
    case AUTOCROP_IMAGE:
      return { ...state, cropping_method: 100 }
    case IMAGE_FILE_PATCHED:
    case ADD_IMAGE:
      console.log(action)
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const reducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_IMAGE:
    case IMAGE_FILE_PATCHED:
    case AUTOCROP_IMAGE:
    case REQUEST_IMAGE_FILE: {
      let key = action.payload.id
      let im = state[key]
      return { ...state, [key]: image(im, action) }
    }
    default:
      return state
  }
}
