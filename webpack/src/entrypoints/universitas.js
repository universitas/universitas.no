// frontpage of universitas.no react app
import 'babel-polyfill'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Universitas from './Universitas'

const ROOT_ID = 'ReactApp'
const DOMNode = document.getElementById(ROOT_ID)

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Universitas />
    </AppContainer>,
    DOMNode
  )
}

if (DOMNode) {
  render()
  module.hot && module.hot.accept('./Universitas', render)
} else {
  console.error(`Could not mount React App, because  #${ROOT_ID} was not found`)
}
