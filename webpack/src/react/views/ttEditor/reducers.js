import { combineReducers } from 'redux'
import * as actions from './actions'

const defaultTextState = {
  content: '',
  activeIndex: 0,
  nodes: [],
}

const textReducer = (state = defaultTextState, { type, payload }) => {
  switch (type) {
    case actions.TEXT_CHANGED:
      return { ...state, ...payload }
    case actions.EDIT_INDEX_CHANGED:
      return { ...state, ...payload }
    default:
      return state
  }
}

export default combineReducers({
  text: textReducer,
})
