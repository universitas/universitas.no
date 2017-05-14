/* eslint-env browser */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { FrontpageCrop, imageClickHandler } from './containers/FrontpageCrop'

const render = (App, domNode) => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    domNode
  )
}

const cropIconOnClick = id => e => {
  e.preventDefault()
  imageClickHandler(id)
}
// dispatches action when image is clicked.
const bindEventToImageFiles = () => {
  const cropIcons = document.querySelectorAll('a[data-imagefile-pk]')
  cropIcons.forEach(icon => {
    const id = icon.getAttribute('data-imagefile-pk')
    icon.addEventListener('click', cropIconOnClick(id))
  })
}

export default () => {
  const domNode = document.getElementById('PhotoCrop')
  if (domNode) {
    bindEventToImageFiles()
    render(FrontpageCrop, domNode)
    if (module.hot) {
      module.hot.accept('./containers/FrontpageCrop', () =>
        render(FrontpageCrop, domNode)
      )
    }
  }
}
