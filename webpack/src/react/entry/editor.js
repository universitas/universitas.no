import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from '../views/ttEditor/App'

const ROOT_ID = 'ReactApp'

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
module.hot && module.hot.accept('../views/ttEditor/App', render)
