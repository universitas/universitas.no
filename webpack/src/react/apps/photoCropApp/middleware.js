import { debounce } from 'lodash'

import { persistStore } from 'redux-persist'
import { END_DRAG_HANDLE, getCropWidget } from './ducks/cropWidget'
import { AUTOCROP_IMAGE, imageFilePatched } from './ducks/images'
import { apiPatch } from './ducks/api'

const patchImage = apiPatch('images')
const AUTOCROP = 1

const updateCropBox = (store, imageId) => {
  const { crop_box } = getCropWidget(store.getState())
  debouncedPatchImage(store, imageId, { crop_box })
}
const doAutoCrop = (store, imageId) => {
  debouncedPatchImage(store, imageId, { cropping_method: AUTOCROP })
}

const debouncedPatchImage = debounce((store, imageId, patch_data) => {
  apiPatch('images')(imageId, patch_data)(store.dispatch).then(json =>
    store.dispatch(imageFilePatched({ ...json, id: imageId }))
  )
}, 100)

export const apiMiddleware = store => next => action => {
  switch (action.type) {
    case AUTOCROP_IMAGE:
      doAutoCrop(store, action.payload.id)
      break
    case END_DRAG_HANDLE:
      updateCropBox(store, action.payload.id)
      break
  }
  return next(action)
}
