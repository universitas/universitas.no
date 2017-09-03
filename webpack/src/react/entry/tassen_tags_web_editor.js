import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './ttEditor'

const ROOT_ID = 'ReactApp'

const render = domNode => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    domNode
  )
}

const domNode = document.getElementById(ROOT_ID)
if (domNode) {
  render(domNode)
  module.hot && module.hot.accept('./ttEditor', () => render(domNode))
}
