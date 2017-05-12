import { debounce } from 'lodash'
import { patchImage } from './actions'

const debouncedPatchImage = debounce((store, id) => {
  const data = store.getState().images[id]
  store.dispatch(patchImage(id, data))
}, 1000)

export const apiMiddleware = store => next => action => {

  switch(action.type) {
  case 'END_DRAG_HANDLE':
    debouncedPatchImage(store, action.payload.id)
  }
  return next(action)
}

