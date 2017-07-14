import R from 'ramda'
import { blockParser } from 'utils/tagParser'

const TEXT_CHANGED = 'TEXT_CHANGED'
const INSERT_TEXT = 'INSERT_TEXT'
const CHANGE_TAG = 'CHANGE_TAG'
const MOVE_CARET = 'MOVE_CARET'

export const textChanged = content => ({
  type: TEXT_CHANGED,
  payload: { content },
})
export const insertText = text => ({
  type: INSERT_TEXT,
  payload: { text },
})
export const changeTag = tag => ({
  type: CHANGE_TAG,
  payload: { tag },
})
export const moveCaret = caret => ({
  type: MOVE_CARET,
  payload: { caret },
})

// selectors
export const getEditor = R.prop('editor')
export const getContent = R.compose(R.prop('content'), getEditor)
export const getActiveIndex = R.compose(R.prop('activeIndex'), getEditor)
export const getNodes = R.compose(blockParser, getContent)

// reducers
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
const addText = (text, content, caret = 0) =>
  content.slice(0, caret) + content.slice(caret).replace(/$/m, text)

const replaceTag = (tag, content, caret = 0) => {
  const head = content.slice(0, caret)
  const lastIndex = head.includes('\n') ? /[\s\S]*\n/.exec(head)[0].length : 0
  const needle = /^(@\S*: *)?/
  const replacement = tag ? `@${tag}: ` : ''
  return (
    content.slice(0, lastIndex) +
    content.slice(lastIndex).replace(needle, replacement)
  )
}

export const reducer = (state = defaultTextState, { type, payload }) => {
  switch (type) {
    case TEXT_CHANGED:
      return { ...state, ...payload }
    case MOVE_CARET:
      return {
        ...state,
        caret: payload.caret,
        activeIndex: (state.content
          .slice(0, payload.caret)
          .trim()
          .match(/\n+/g) || []).length,
      }
    case CHANGE_TAG:
      return {
        ...state,
        content: replaceTag(payload.tag, state.content, state.caret),
      }
    case INSERT_TEXT:
      return {
        ...state,
        content: addText(payload.text, state.content, state.caret),
      }
    default:
      return state
  }
}
