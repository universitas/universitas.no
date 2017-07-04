import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import PhotoCropApp from 'apps/photoCropApp'

const ROOT_ID = 'PhotoApp'

const render = () => {
  const domNode = document.getElementById(ROOT_ID)
  if (!domNode) return
  ReactDOM.render(
    <AppContainer>
      <PhotoCropApp />
    </AppContainer>,
    domNode
  )
}

render()
module.hot && module.hot.accept('apps/photoCropApp', render)
