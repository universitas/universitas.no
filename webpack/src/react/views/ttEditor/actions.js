export const TEXT_CHANGED = 'TEXT_CHANGED'
export const textChanged = content => ({
  type: TEXT_CHANGED,
  payload: { content },
})
export const INSERT_TEXT = 'INSERT_TEXT'
export const insertText = text => ({
  type: INSERT_TEXT,
  payload: { text },
})
export const CHANGE_TAG = 'CHANGE_TAG'
export const changeTag = tag => ({
  type: CHANGE_TAG,
  payload: { tag },
})
export const MOVE_CARET = 'MOVE_CARET'
export const moveCaret = caret => ({
  type: MOVE_CARET,
  payload: { caret },
})
