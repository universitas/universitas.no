// express server

import '@babel/polyfill'
import express from 'express'
import morgan from 'morgan'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import App from './App'
import configureStore from './configureStore.js'

// the main application
const Universitas = ({ store }) => (
  <Provider store={store}>
    <App />
  </Provider>
)

// extract the html headers inserted by Helmet to pass to the django template
const headers = () => {
  const helmet = Helmet.renderStatic()
  return R.unless(R.is(String), R.map(attr => attr.toString()), helmet)
}

// reset all state slices with status "fetching": true
// so that we dispatch new fetch actions for the api saga client side
const notFetching = R.map(
  R.cond([
    [R.has('fetching'), R.assoc('fetching', false)],
    [R.is(Array), a => R.map(notFetching, a)],
    [R.T, R.identity],
  ]),
)

const serializeError = error =>
  JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))

// perform react server side rendering
const renderReact = (path, { actions, url }) => {
  const store = configureStore(undefined, [path])
  R.forEach(action => store.dispatch(action), actions)
  const html = renderToString(<Universitas store={store} />)
  const state = notFetching(store.getState())
  const HTTPStatus = R.test(/NOT_FOUND$/, state.location.type) ? 404 : 200
  return { html, HTTPStatus, state, headers: headers() }
}

// express render handler
const renderHandler = (req, res) => {
  global.SERVER_SIDE = true // add a global flag
  global.location = { href: url } // mock window.location
  const actions = req.body // fake redux actions created in django view
  const url = req.url
  try {
    const result = renderReact(url, actions)
    res.json({ url, ...result })
  } catch (error) {
    res.json({ url, error: serializeError(error) })
  }
}

// main express server function
const serve = () => {
  const PORT = process.env.NODE_PORT || 9000
  const app = express()
  app.use(express.json({ limit: '10mb' }))
  app.set('json spaces', 2)
  app.use(morgan('dev'))
  app.get(/\.ico$/, (req, res) => res.status(404).send())
  app.use(renderHandler)
  app.listen(PORT, () => console.log(`listening on port ${PORT}`))
}

serve()
