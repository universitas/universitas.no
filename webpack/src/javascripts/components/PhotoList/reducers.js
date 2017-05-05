import { UPDATE_SEARCH, TOGGLE_IMAGE_TYPE, FETCHED_IMAGES } from './actions'

export const searchField = (state={ content: '' }, action) => {
  switch (action.type) {
  case UPDATE_SEARCH:
  case TOGGLE_IMAGE_TYPE:
    return { ...state, ...action.payload }
  default:
    return state
  }
}

export const imageList = (state=[], action) => {
  switch (action.type) {
  case FETCHED_IMAGES:
    return action.payload.image_ids
  default:
    return state
  }
}
