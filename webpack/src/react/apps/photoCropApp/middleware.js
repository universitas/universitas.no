import { debounce } from 'lodash'
import { persistStore } from 'redux-persist'
import { END_DRAG_HANDLE } from './ducks/cropWidget'
import { AUTOCROP_IMAGE } from './ducks/images'
import { imageFilePatched } from './ducks/images'

const debouncedPatchImage = debounce((store, id) => {
  const data = store.getState().images[id]
  store.dispatch(imageFilePatched(id, data))
}, 1000)

export const apiMiddleware = store => next => action => {
  switch (action.type) {
    case AUTOCROP_IMAGE:
    case END_DRAG_HANDLE:
      debouncedPatchImage(store, action.payload.id)
  }
  return next(action)
}
