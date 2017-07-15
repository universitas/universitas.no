import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import PhotoCropApp from './photoCropApp'

const ROOT_ID = 'PhotoApp'

const render = App => {
  const domNode = document.getElementById(ROOT_ID)
  if (!domNode) return
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    domNode
  )
}

render(PhotoCropApp)
module.hot && module.hot.accept('./photoCropApp', () => render(PhotoCropApp))
