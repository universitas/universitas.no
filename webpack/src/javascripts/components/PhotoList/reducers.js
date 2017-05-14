import * as actions from './actions'

const defaultState = { images: [], text: '', fetching: false }

export const searchField = (state = defaultState, action) => {
  switch (action.type) {
    case actions.CLEAR_SEARCH:
      return defaultState
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
