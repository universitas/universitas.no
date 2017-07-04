import R from 'ramda'
import { combineReducers } from 'redux'
import { getUi } from './ui'

// Action types
const CYCLE_PANEL_DATA = 'cropPanel/CYCLE_PANEL_DATA'
const RESIZE_PANEL = 'cropPanel/RESIZE_PANEL'
const DISMISS_PANEL = 'cropPanel/DISMISS_PANEL'
const SELECT_IMAGE = 'cropPanel/SELECT_IMAGE'

// Selectors
// const getCropPanelData = R.pipe(getUi, R.prop('data'))
// const getCropPanelSize = R.pipe(getUi, R.prop('expanded'))
const getCropPanelData = R.always(0)
const getCropPanelSize = R.T

// Action creators
export const dismissWidget = () => ({
  type: DISMISS_WIDGET,
})
export const resizeWidget = () => ({
  type: RESIZE_WIDGET,
})
export const cycleWidgetPanels = () => ({
  type: CYCLE_PANEL_DATA,
})

// Reducers
export const reducer = (
  state = { image: 0, expanded: false, data: 0 },
  action
) => {
  const PANEL_STATES = 3 // number of possible states
  switch (action.type) {
    case SELECT_IMAGE:
      return { ...state, image: action.payload.id }
    case DISMISS_PANEL:
      return { ...state, image: 0 }
    case RESIZE_PANEL:
      return { ...state, expanded: !state.expanded }
    case CYCLE_PANEL_DATA:
      return { ...state, data: (state.data + 1) % PANEL_STATES }
    default:
      return state
  }
}
