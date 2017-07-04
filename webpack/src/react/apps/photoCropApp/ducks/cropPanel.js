import R from 'ramda'
import { getImage } from './images'

// Action types
const CYCLE_PANEL_DATA = 'cropPanel/CYCLE_PANEL_DATA'
const RESIZE_PANEL = 'cropPanel/RESIZE_PANEL'
const DISMISS_PANEL = 'cropPanel/DISMISS_PANEL'
export const SELECT_IMAGE = 'cropPanel/SELECT_IMAGE'

// Selectors
// const getCropPanelData = R.pipe(getUi, R.prop('data'))
// const getCropPanelSize = R.pipe(getUi, R.prop('expanded'))
export const getCropPanel = state => state.ui.cropPanel
export const getCropPanelData = state => state.ui.cropPanel.data
export const getCropPanelSize = state => state.ui.cropPanel.expanded
export const getSelectedImage = state => state.ui.cropPanel.image

// Action creators
const selectImage = (id, crop_box) => ({
  type: SELECT_IMAGE,
  payload: { id, crop_box },
})
export const dismissPanel = () => ({
  type: DISMISS_PANEL,
})
export const resizePanel = () => ({
  type: RESIZE_PANEL,
})
export const cyclePanelData = () => ({
  type: CYCLE_PANEL_DATA,
})
export const imageSelected = id => (dispatch, getState) => {
  const { crop_box } = getImage(getState(), id)
  dispatch(selectImage(id, crop_box))
}

// Reducers
const initialState = { image: 0, expanded: false, data: 0 }
const PANEL_STATES = 3 // number of possible states

export const reducer = (state = initialState, action) => {
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
