// Server side rendering of frontpage
import 'babel-polyfill'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import App from './App'
import configureStore from './configureStore.js'

const headers = () => {
  const helmet = Helmet.renderStatic()
  return R.unless(R.is(String), R.map(attr => attr.toString()), helmet)
}

const notFetching = R.map(
  R.cond([
    [R.has('fetching'), R.assoc('fetching', false)],
    [R.is(Array), a => R.map(notFetching, a)],
    [R.T, R.identity],
  ]),
)

export default (url, actions = []) => {
  const store = configureStore(undefined, url)
  global.location = { href: `http://universitas.no${url}` }
  global.server = true
  R.forEach(action => store.dispatch(action), actions)
  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  )
  const state = notFetching(store.getState())
  const HTTPStatus = R.test(/NOT_FOUND$/, state.location.type) ? 404 : 200
  return { html, HTTPStatus, state, headers: headers() }
}
