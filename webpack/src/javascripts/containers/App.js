/* eslint-env browser */
import PropTypes from 'prop-types'
import React from 'react'
import { CropBox } from '../components'
import { Provider, connect } from 'react-redux'
import { rootStore } from './store'

const Spinner = () => <div className="spinner">Loading...</div>

let App = ({ id, loaded }) => (
  <section className="ReactApp">
    <h1>CropBox</h1>
    {id ? (loaded ? <CropBox id={id} /> : <Spinner />) : <p>click image</p>}
  </section>
)

App = connect(state => ({
  id: state.selectedImage,
  loaded: Boolean(state.images[state.selectedImage]),
}))(App)

const Root = () => (
  <Provider store={rootStore}>
    <App />
  </Provider>
)

export default Root
