// Action creators
export const setCenter = (id, position) => ({
  type: 'MOVE_CENTER',
  payload: { id, position },
})

export const startDragHandle = (id, position, dragMask) => ({
  type: 'START_DRAG_HANDLE',
  payload: { id, position, dragMask },
})

export const startNewCrop = (id, position) => ({
  type: 'START_NEW_CROP',
  payload: { id, position },
})

export const moveDragHandle = (id, position) => ({
  type: 'MOVE_DRAG_HANDLE',
  payload: { id, position },
})

export const endDragHandle = (id) => ({
  type: 'END_DRAG_HANDLE',
  payload: { id },
})

export const setImgSize = (id, size) => ({
  type: 'SET_IMAGE_SIZE',
  payload: { id, size },
})

export const addImage = (id, src, crop) => ({
  type: 'ADD_IMAGE',
  payload: { id, src, crop },
})
