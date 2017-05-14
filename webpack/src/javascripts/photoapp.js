/* eslint-env browser */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import RootContainer from './containers/RootContainer'

const render = (App, domNode) => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    domNode
  )
}

export default () => {
  const domNode = document.getElementById('PhotoApp')
  if (domNode) {
    render(RootContainer, domNode)
    if (module.hot) {
      module.hot.accept('./containers/RootContainer', () =>
        render(RootContainer, domNode)
      )
    }
  }
}
