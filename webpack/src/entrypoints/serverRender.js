// Server side rendering of frontpage
import 'babel-polyfill'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import App from './Universitas/App'
import configureStore from './Universitas/configureStore.js'

const headers = () => {
  // const attrs = [
  //   'base',
  //   'bodyAttributes',
  //   'htmlAttributes',
  //   'link',
  //   'meta',
  //   'noscript',
  //   'script',
  //   'style',
  //   'title',
  // ]
  const helmet = Helmet.renderStatic()
  return R.map(attr => attr.toString(), helmet)
}

export default (url, actions) => {
  const store = configureStore(undefined, url)
  R.forEach(action => store.dispatch(action), actions)
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  )
  return { html, state: store.getState(), headers: headers() }
}
