import { SEARCH_CHANGED, TOGGLE_IMAGE_TYPE, FETCHED_IMAGES } from './actions'

export const searchField = (state = { text: '' }, action) => {
  switch (action.type) {
    case SEARCH_CHANGED:
    case TOGGLE_IMAGE_TYPE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export const imageList = (state = [], action) => {
  switch (action.type) {
    case FETCHED_IMAGES:
      return action.payload.image_ids
    default:
      return state
  }
}
