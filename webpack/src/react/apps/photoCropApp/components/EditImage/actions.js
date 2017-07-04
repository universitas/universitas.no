export const CYCLE_PANELS = 'editimage/CYCLE_PANELS'
export const RESIZE_WIDGET = 'editimage/RESIZE_WIDGET'
export const DISMISS_WIDGET = 'editimage/DISMISS_WIDGET'
export const AUTOCROP_IMAGE = 'editimage/AUTOCROP_IMAGE'
export const SELECT_IMAGE = 'editimage/SELECT_IMAGE'

export const selectImage = id => ({
  type: SELECT_IMAGE,
  payload: { id },
})
export const autocropImage = id => ({
  type: AUTOCROP_IMAGE,
  payload: { id },
})
export const dismissWidget = () => ({
  type: DISMISS_WIDGET,
})
export const resizeWidget = () => ({
  type: RESIZE_WIDGET,
})
export const cycleWidgetPanels = () => ({
  type: CYCLE_PANELS,
})
