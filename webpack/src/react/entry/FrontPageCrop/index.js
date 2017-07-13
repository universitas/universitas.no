/* eslint-env browser */
import React from 'react'
import { combineReducers } from 'redux'
import { connect, Provider } from 'react-redux'

import { getSelectedImage } from 'ducks/cropPanel'
import { reducer as images } from 'ducks/images'
import { imageClicked, reducer as ui } from 'ducks/ui'

import EditImage from 'containers/EditImage'
import configureStore from '../photoCropApp/configureStore'

const rootReducer = combineReducers({ ui, images })
const rootStore = configureStore(rootReducer)

const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  zIndex: 1000,
  background: 'none',
  pointerEvents: 'none',
}

const empty = {
  pointerEvents: 'none',
  flex: 2,
}

const mapStateToProps = state => ({
  active: getSelectedImage(state),
})

const CropBox = connect(mapStateToProps)(
  ({ active }) =>
    active
      ? <section className="FrontPageCrop" style={style}>
          <EditImage />
          <div style={empty} />
        </section>
      : null
)
export const FrontPageCrop = () => (
  <Provider store={rootStore}>
    <CropBox />
  </Provider>
)
// selects another image
export const imageClickHandler = id => {
  rootStore.dispatch(imageClicked(id))
}
