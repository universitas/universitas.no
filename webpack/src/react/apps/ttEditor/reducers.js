import { combineReducers } from 'redux'
import * as actions from './actions'
import R from 'ramda'

const defaultTextState = {
  content: '',
  caret: 0,
  activeIndex: 0,
  nodes: [],
}

const paragraphSplits = (content = '') => {
  const regex = /\s*$/gm
  const splits = [0]
  while (regex.exec(content) !== null)
    splits.push(regex.lastIndex)
  return splits
}
const insertText = (text, content, caret = 0) =>
  content.slice(0, caret) + content.slice(caret).replace(/$/m, text)

const changeTag = (tag, content, caret = 0) => {
  const head = content.slice(0, caret)
  const lastIndex = head.includes('\n') ? /[\s\S]*\n/.exec(head)[0].length : 0
  const needle = /^(@\S*: *)?/
  const replacement = tag ? `@${tag}: ` : ''
  return (
    content.slice(0, lastIndex) +
    content.slice(lastIndex).replace(needle, replacement)
  )
}

const textReducer = (state = defaultTextState, { type, payload }) => {
  switch (type) {
    case actions.TEXT_CHANGED:
      return { ...state, ...payload }
    case actions.MOVE_CARET:
      return {
        ...state,
        caret: payload.caret,
        activeIndex: (state.content
          .slice(0, payload.caret)
          .trim()
          .match(/\n+/g) || []).length,
      }
    case actions.CHANGE_TAG:
      console.log(type, payload)
      return {
        ...state,
        content: changeTag(payload.tag, state.content, state.caret),
      }
    case actions.INSERT_TEXT:
      console.log(type, payload)
      return {
        ...state,
        content: insertText(payload.text, state.content, state.caret),
      }
    default:
      return state
  }
}

export default combineReducers({ text: textReducer })
