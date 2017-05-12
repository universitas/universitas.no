/* eslint-env browser */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { imgOnClick } from './containers/store'
import RootContainer from './containers/RootContainer'

const render = (App, domNode) => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    domNode
  )
}

// dispatches action when image is clicked.
const bindEventToImageFiles = () => {
  const imageFiles = document.querySelectorAll('img[data-pk]')
  imageFiles.forEach(img => {
    img.addEventListener('click', imgOnClick)
  })
}

export default () => {
  const domNode = document.getElementById('react-container')
  if (domNode) {
    bindEventToImageFiles()
    render(RootContainer, domNode)
    if (module.hot) {
      module.hot.accept('./containers/RootContainer', () =>
        render(RootContainer, domNode)
      )
    }
  }
}
