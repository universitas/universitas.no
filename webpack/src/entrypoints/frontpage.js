import 'babel-polyfill'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

import FrontPage, { rootStore } from './FrontPage'

const ROOT_ID = 'ReactApp'
const DOMNode = document.getElementById(ROOT_ID)

const render = () =>
  ReactDOM.render(
    <AppContainer>
      <FrontPage />
    </AppContainer>,
    DOMNode
  )

if (DOMNode) {
  render()
  module.hot && module.hot.accept('./FrontPage', render)
} else
  console.log(`Could not mount React App, because  #${ROOT_ID} was not found`)
