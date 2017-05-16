export const selectImage = id => ({
  type: 'SELECT_IMAGE',
  payload: { id },
})
export const autocropImage = id => ({
  type: 'AUTOCROP_IMAGE',
  payload: { id },
})
export const shrink = () => ({
  type: 'SHRINK_WIDGET',
})
export const expand = () => ({
  type: 'EXPAND_WIDGET',
})
export const dismiss = () => ({
  type: 'DISMISS_WIDGET',
})
