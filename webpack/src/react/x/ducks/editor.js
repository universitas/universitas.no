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
export const getNodes = R.compose(R.prop('nodes'), getEditor)

// reducers
const paragraphSplits = (content = '') => {
  const regex = /\s*$/gm
  const splits = [0]
  while (regex.exec(content) !== null) splits.push(regex.lastIndex)
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

const moveIndex = ({ content, caret }) =>
  (content
    .slice(0, caret)
    .trim()
    .match(/\n+/g) || []
  ).length

const mergeNodes = state => ({
  ...state,
  nodes: blockParser(state.content),
})

const reducers = R.fromPairs([
  [
    TEXT_CHANGED,
    ({ content }) => R.pipe(R.assoc('content', content), mergeNodes),
  ],
  [
    CHANGE_TAG,
    ({ tag }) => state =>
      R.merge(state, { content: replaceTag(tag, state.content, state.caret) }),
  ],
  [
    INSERT_TEXT,
    ({ text }) => state =>
      R.merge(state, { content: addText(text, state.content, state.caret) }),
  ],
  [
    MOVE_CARET,
    payload =>
      R.pipe(R.merge(R.__, payload), s =>
        R.assoc('activeIndex', moveIndex(s), s),
      ),
  ],
])

const getReducer = ({ type, payload }) => {
  const reducer = reducers[type]
  if (!reducer) return R.identity
  return reducer(payload)
}

const defaultTextState = {
  content: '',
  caret: 0,
  activeIndex: 0,
  nodes: [],
}

export const reducer = (state = defaultTextState, action) =>
  getReducer(action)(state)
