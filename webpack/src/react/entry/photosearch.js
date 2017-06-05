import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from '../views/photoCropApp/containers/RootContainer'

const ROOT_ID = 'PhotoApp'

const render = () => {
  const domNode = document.getElementById(ROOT_ID)
  if (!domNode) return
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    domNode
  )
}

render()
module.hot &&
  module.hot.accept('../views/photoCropApp/containers/RootContainer', render)
