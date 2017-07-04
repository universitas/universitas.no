/* eslint-env browser */
import React from 'react'
import { combineReducers } from 'redux'
import { EditImage } from '../components'
import { connect, Provider } from 'react-redux'
import configureStore from '../configureStore'
import { imageSelected, getSelectedImage } from '../ducks/cropPanel'
import { reducer as ui } from '../ducks/ui'
import { reducer as images } from '../ducks/images'

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
  active: getSelectedImage(state) !== 0,
})

const CropBox = connect(mapStateToProps)(
  ({ active }) =>
    active
      ? <section className="FrontpageCrop" style={style}>
          <EditImage />
          <div style={empty} />
        </section>
      : null
)
export const FrontpageCrop = () => (
  <Provider store={rootStore}>
    <CropBox />
  </Provider>
)
// selects another image
export const imageClickHandler = id => {
  console.log('clicked: ', id)
  rootStore.dispatch(imageSelected(id))
  //rootStore.dispatch(fetchImageFile(id))
}
