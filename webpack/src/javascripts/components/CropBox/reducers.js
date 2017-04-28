import { combineReducers } from 'redux'

const imageDefaultState = {
  src: '',
  dragging: {},
  size: [],
  crop: {},
}

const normalize = (dim) => {
  const sorted = [0, dim[0], dim[2], 1].sort((a, b) => a - b)
  return [sorted[1], dim[1], sorted[2]]
}

const image = (state, action) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return state || { ...imageDefaultState, ...action.payload }
    case 'MOVE_CENTER': {
      const [x, y] = action.payload.position
      const { h, v } = state.crop
      return {
        ...state,
        crop: {
          h: normalize([h[0], x, h[2]]),
          v: normalize([v[0], y, v[2]]),
        },
      } }

    case 'START_NEW_CROP': {
      const [x, y] = action.payload.position
      return {
        ...state,
        crop: {
          h: [x, state.crop.h[1], x],
          v: [y, state.crop.v[1], y],
        },
        dragging: {
          dragMask: [1, 1, 0, 0, 0],
          initialPosition: action.payload.position,
          initialCrop: state.crop,
        },
      } }

    case 'START_DRAG_HANDLE':
      return {
        ...state,
        dragging: {
          dragMask: action.payload.dragMask,
          initialPosition: action.payload.position,
          initialCrop: state.crop,
        },
      }
    case 'MOVE_DRAG_HANDLE': {
      const [left, top, right, bottom, center] = state.dragging.dragMask
      const [x, y] = action.payload.position
      const { h, v } = state.crop
      let crop = {
        h: [left ? x : h[0], center ? x : h[1], right ? x : h[2]],
        v: [top ? y : v[0], center ? y : v[1], bottom ? y : v[2]],
      }
      if (left && right && top && bottom) {
        const { initialPosition: pi, initialCrop: { h: hi, v: vi } } = state.dragging
        const dx = x - pi[0]
        const dy = y - pi[1]
        crop = {
          h: [hi[0] + dx, hi[1], hi[2] + dx],
          v: [vi[0] + dy, vi[1], vi[2] + dy],
        }
      }
      return { ...state, crop } }
    case 'END_DRAG_HANDLE':
      return {
        ...state,
        crop: {
          h: normalize(state.crop.h),
          v: normalize(state.crop.v),
        },
        dragging: {},
      }
    case 'SET_IMAGE_SIZE':
      return { ...state, size: action.payload.size }
    default:
      return state
  }
}

const images = (state = {}, action) => {
  if (action.payload && action.payload.src) {
    const src = action.payload.src
    const newState = { ...state }
    newState[src] = image(state[src], action)
    return newState
  }
  return state
}

const cropBoxReducer = combineReducers({
  images,
})
export { normalize, cropBoxReducer }
