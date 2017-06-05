export const selectImage = id => ({
  type: 'SELECT_IMAGE',
  payload: { id },
})
export const autocropImage = id => ({
  type: 'AUTOCROP_IMAGE',
  payload: { id },
})
export const dismissWidget = () => ({
  type: 'DISMISS_WIDGET',
})
export const resizeWidget = () => ({
  type: 'RESIZE_WIDGET',
})
export const cycleWidgetPanels = () => ({
  type: 'CYCLE_PANELS',
})
