import R from 'ramda'
import { normalize, round } from '../components/CropBox/utils'
import { SELECT_IMAGE } from './cropPanel'
// Action constants
const MOVE_CENTER = 'cropbox/MOVE_CENTER'
const START_DRAG_HANDLE = 'cropbox/START_DRAG_HANDLE'
const START_NEW_CROP = 'cropbox/START_NEW_CROP'
const MOVE_DRAG_HANDLE = 'cropbox/MOVE_DRAG_HANDLE'
export const END_DRAG_HANDLE = 'cropbox/END_DRAG_HANDLE'

// Selectors
export const getCropWidget = state => state.ui.cropWidget

// Action creators
export const setCenter = (id, position) => ({
  type: MOVE_CENTER,
  payload: { id, position },
})

export const startDragHandle = (id, position, dragMask) => ({
  type: START_DRAG_HANDLE,
  payload: { id, position, dragMask },
})

export const startNewCrop = (id, position) => ({
  type: START_NEW_CROP,
  payload: { id, position },
})

export const moveDragHandle = (id, position) => ({
  type: MOVE_DRAG_HANDLE,
  payload: { id, position },
})

export const endDragHandle = id => ({
  type: END_DRAG_HANDLE,
  payload: { id },
})

const initialState = {
  dragging: {},
  crop_box: { x: 0.5, y: 0.5, left: 0, top: 0, right: 1, bottom: 1 },
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_IMAGE: {
      return { ...state, crop_box: action.payload.crop_box }
    }
    case MOVE_CENTER: {
      const [mx, my] = action.payload.position
      return {
        ...state,
        crop_box: { ...state.crop_box, x: mx, y: my },
      }
    }
    case START_NEW_CROP: {
      const [mx, my] = action.payload.position.map(round)
      return {
        ...state,
        crop_box: {
          ...state.crop_box,
          left: mx,
          top: my,
          right: mx,
          bottom: my,
        },
        dragging: {
          dragMask: [1, 1, 0, 0, 0],
          initialPosition: [mx, my],
          initialCrop: state.crop_box,
        },
      }
    }

    case START_DRAG_HANDLE:
      return {
        ...state,
        dragging: {
          dragMask: action.payload.dragMask,
          initialPosition: action.payload.position.map(round),
          initialCrop: state.crop_box,
        },
      }
    case MOVE_DRAG_HANDLE: {
      const [mx, my] = action.payload.position.map(round)
      const { initialPosition: [ix, iy], initialCrop: ic } = state.dragging
      let { x, y, left, top, right, bottom } = state.crop_box
      let [dl, dt, dr, db, dc] = state.dragging.dragMask
      const dx = mx - ix
      const dy = my - iy
      dc && (x = mx)
      dc && (y = my)
      dl && (left = mx)
      dt && (top = my)
      dr && (right = mx)
      db && (bottom = my)
      if (dl && dr && dt && db) {
        left = round(ic.left + dx)
        top = round(ic.top + dy)
        right = round(ic.right + dx)
        bottom = round(ic.bottom + dy)
      }
      top > bottom && ([dt, db] = [db, dt])
      left > right && ([dl, dr] = [dr, dl])
      return {
        ...state,
        crop_box: normalize({ x, y, left, top, right, bottom }),
        dragging: { ...state.dragging, dragMask: [dl, dt, dr, db, dc] },
      }
    }
    case END_DRAG_HANDLE:
      return {
        ...state,
        crop_box: normalize(state.crop_box),
        dragging: {},
      }
    default:
      return state
  }
}
