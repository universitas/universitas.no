/* eslint-env browser */
import PropTypes from 'prop-types'
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { CropBox } from '../components'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { selectImage, fetchImageFile, patchImage } from './actions'
import rootReducer from './reducers'

// react-dev-tools
const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const rootStore = createStore(
  rootReducer,
  {},
  composeEnhancers(applyMiddleware(
    thunkMiddleware,
    createLogger()
  )),
)

const Spinner = () => <div className="spinner">Loading...</div>

let App = ({id, loaded}) => (
  <section className="ReactApp">
    {id ? ( loaded ? <CropBox id={id}/> : <Spinner /> ) : <p>select an image</p> }
    <button onClick={ patchButtonOnClick } > Patch </button>
  </section>
)

App = connect(
  state => ({
    id: state.selectedImage,
    loaded: Boolean(state.images[state.selectedImage]),
  })
)(App)

App.propTypes = {
  id: PropTypes.string,
  loaded: PropTypes.bool,
}

const Root = () => (
  <Provider store={ rootStore }>
    <App />
  </Provider>
)
const patchButtonOnClick = () => {
  const state = rootStore.getState()
  const id = state.selectedImage
  const data = state.images[id]
  rootStore.dispatch(patchImage(id, data))
}

// selects another image
const imgOnClick = (e) => {
  const img = e.target
  const id = img.getAttribute('data-pk')
  rootStore.dispatch(selectImage(id))
  rootStore.dispatch(fetchImageFile(id))
}

export { Root, imgOnClick }
