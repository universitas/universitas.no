import * as actions from './actions'

const defaultState = { images: [], text: '', thumbStyle: 0, fetching: false }

export const searchField = (state = defaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_SEARCH:
      return defaultState
    case actions.TOGGLE_THUMB_STYLE:
      return { ...state, thumbStyle: (state.thumbStyle + 1) % 3 }
    case actions.SEARCH_CHANGED:
      return { ...state, ...action.payload }
    case actions.TOGGLE_IMAGE_TYPE:
      return { ...state, fetching: true, ...action.payload }
    case actions.FETCHED_IMAGES:
      return { ...state, fetching: false, ...action.payload }
    case actions.FETCHING_IMAGES:
      return { ...state, fetching: true, ...action.payload }
    default:
      return state
  }
}
