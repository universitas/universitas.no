/* eslint-env browser */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { imgOnClick } from './containers/store'
import Root from './containers/App'

const render = (App, container) => {
  console.log('render')
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    container
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
  const container = document.getElementById('react-container')
  if (container) {
    bindEventToImageFiles()
    render(Root, container)
    if (module.hot) {
      module.hot.accept('./containers/App', () => render(Root, container))
    }
  }
}
