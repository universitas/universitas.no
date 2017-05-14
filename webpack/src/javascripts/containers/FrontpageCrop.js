/* eslint-env browser */
import React from 'react'
import { EditImage } from '../components'
import { Provider } from 'react-redux'
import { rootStore } from './store'
export { imageClickHandler } from './store'

const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  padding: '1em',
  width: '50vw',
  height: '100vh',
  zIndex: 1000,
  background: 'white',
}

const FrontpageCrop = () => (
  <Provider store={rootStore}>
    <EditImage style={style} />
  </Provider>
)

export { FrontpageCrop }
