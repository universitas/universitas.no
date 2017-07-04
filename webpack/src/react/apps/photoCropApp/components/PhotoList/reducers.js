import {
  CLEAR_SEARCH,
  SEARCH_CHANGED,
  TOGGLE_THUMB_STYLE,
  TOGGLE_IMAGE_TYPE,
  FETCHED_IMAGES,
  FETCHING_IMAGES,
} from './actions'

const defaultState = { images: [], text: '', thumbStyle: 0, fetching: false }

export const searchField = (state = defaultState, action) => {
  switch (action.type) {
    case CLEAR_SEARCH:
      return defaultState
    case SEARCH_CHANGED:
      return { ...state, ...action.payload }
    case TOGGLE_THUMB_STYLE:
      return { ...state, thumbStyle: (state.thumbStyle + 1) % 3 }
    case TOGGLE_IMAGE_TYPE:
      return { ...state, fetching: true, ...action.payload }
    case FETCHED_IMAGES:
      return { ...state, fetching: false, ...action.payload }
    case FETCHING_IMAGES:
      return { ...state, fetching: true, ...action.payload }
    default:
      return state
  }
}
