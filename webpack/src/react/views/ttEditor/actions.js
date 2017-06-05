export const TEXT_CHANGED = 'TEXT_CHANGED'
export const textChanged = (content, caret) => ({
  type: TEXT_CHANGED,
  payload: { content, caret },
})
export const EDIT_INDEX_CHANGED = 'EDIT_INDEX_CHANGED'
export const editIndexChanged = activeIndex => ({
  type: EDIT_INDEX_CHANGED,
  payload: { activeIndex },
})
