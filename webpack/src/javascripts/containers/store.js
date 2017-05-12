import { createStore, applyMiddleware, compose } from 'redux'
import { selectImage, fetchImageFile, patchImage } from './actions'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { apiMiddleware } from './middleware'
import rootReducer from './reducers'

// react-dev-tools
const composeEnhancers =
  (typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose

export const rootStore = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(thunkMiddleware, apiMiddleware))
)

// selects another image
export const imgOnClick = e => {
  const img = e.target
  const id = img.getAttribute('data-pk')
  rootStore.dispatch(selectImage(id))
  rootStore.dispatch(fetchImageFile(id))
}
