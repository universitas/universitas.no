/* eslint-env browser */
import React from 'react'
import { EditImage } from '../components'
import { connect, Provider } from 'react-redux'
import { rootStore, imageClickHandler } from './store'

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
  active: state.cropWidget.id != 0,
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
const FrontpageCrop = () => (
  <Provider store={rootStore}>
    <CropBox />
  </Provider>
)

export { FrontpageCrop, imageClickHandler }
