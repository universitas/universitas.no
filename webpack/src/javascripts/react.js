/* eslint-env browser */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Root, imgOnClick } from './containers/Root'

const render = App => {
  const container = document.getElementById('react-container')
  if (container) {
    ReactDOM.render(<AppContainer><App /></AppContainer>, container)
  }
}

const bindEventToImageFiles = () => {
  const imageFiles = document.querySelectorAll('img[data-pk]')
  imageFiles.forEach(img => img.addEventListener('click', imgOnClick))
}

export default () => {
  bindEventToImageFiles()
  render(Root)
  if (module.hot) module.hot.accept('./containers/Root', () => render(Root))
}
