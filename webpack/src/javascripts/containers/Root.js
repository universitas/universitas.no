/* eslint-env browser */
import PropTypes from 'prop-types'
import React from 'react'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { CropBox } from '../components'
import { Provider, connect } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import { selectImage, fetchImageFile } from './actions'
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
    {id ? loaded
        ? <CropBox id={id}/>
        : <Spinner />
      : <p>select an image</p>
    }
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

// selects another image
const imgOnClick = (e) => {
  const img = e.target
  const id = img.getAttribute('data-pk')
  rootStore.dispatch(selectImage(id))
  rootStore.dispatch(fetchImageFile(id)).then(() => console.log(rootStore.getState()))
}

export { Root, imgOnClick }
