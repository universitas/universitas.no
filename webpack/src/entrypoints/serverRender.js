// Server side rendering of frontpage
import 'babel-polyfill'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import App from './Universitas/App'
import configureStore from './Universitas/configureStore.js'

const headers = () => {
  const helmet = Helmet.renderStatic()
  return R.unless(R.is(String), R.map(attr => attr.toString()), helmet)
}

const notFetching = R.map(R.when(R.has('fetching'), R.assoc('fetching', false)))

export default (url, actions = []) => {
  const store = configureStore(undefined, url)
  global.location = { href: `http://universitas.no${url}` }
  R.forEach(action => store.dispatch(action), actions)
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  )
  return { html, state: notFetching(store.getState()), headers: headers() }
}
