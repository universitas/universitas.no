const imageDefaultState = {
  dragging: {},
}

const normalize = ({ x, y, left, top, right, bottom }) => {
  const func = (a, b) => a - b
  const h_sorted = [0, 0, left, right, 1, 1].sort(func)
  const v_sorted = [0, 0, top, bottom, 1, 1].sort(func)
  return {
    x: [0, x, 1].sort(func)[1],
    y: [0, y, 1].sort(func)[1],
    left: h_sorted[2],
    top: v_sorted[2],
    right: h_sorted[3],
    bottom: v_sorted[3],
  }
}

const round = num => Number(num.toPrecision(4))

const imageReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_IMAGE':
      return { ...imageDefaultState, ...action.payload }
    case 'IMAGE_FILE_PATCHED':
      return { ...state, ...action.payload }
    case 'MOVE_CENTER': {
      const [mx, my] = action.payload.position
      return {
        ...state,
        crop_box: { ...state.crop_box, x: mx, y: my },
      }
    }
    case 'START_NEW_CROP': {
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

    case 'START_DRAG_HANDLE':
      return {
        ...state,
        dragging: {
          dragMask: action.payload.dragMask,
          initialPosition: action.payload.position.map(round),
          initialCrop: state.crop_box,
        },
      }
    case 'MOVE_DRAG_HANDLE': {
      const [mx, my] = action.payload.position.map(round)
      const { initialPosition, initialCrop: ic } = state.dragging
      let { x, y, left, top, right, bottom } = state.crop_box
      let [dl, dt, dr, db, dc] = state.dragging.dragMask
      const dx = mx - initialPosition[0]
      const dy = my - initialPosition[1]
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
    case 'END_DRAG_HANDLE':
      return {
        ...state,
        crop_box: normalize(state.crop_box),
        dragging: {},
      }
    case 'SET_IMAGE_SIZE':
      return { ...state, size: action.payload.size }
    default:
      return state
  }
}

export { imageReducer }
