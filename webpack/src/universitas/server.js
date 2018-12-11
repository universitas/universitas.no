// express server
import express from 'express'
import morgan from 'morgan'
import { Helmet } from 'react-helmet'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import App from './App'
import configureStore from './configureStore.js'
import { parseText, renderText } from 'markup'
import { buildNodeTree } from 'markup/nodeTree'

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
const renderReact = ({ url, actions }) => {
  global.location = { href: url } // mock window.location
  global.SERVER_SIDE = true // add a global flag
  const path = new URL(url).pathname
  const store = configureStore(undefined, [path])
  R.forEach(action => store.dispatch(action), actions)
  const html = renderToString(<Universitas store={store} />)
  const state = notFetching(store.getState())
  const HTTPStatus = R.test(/NOT_FOUND$/, state.location.type) ? 404 : 200
  return { html, HTTPStatus, state, headers: headers() }
}

// express render handler
const renderUniversitas = (req, res) => {
  const { url, actions } = req.body // fake redux actions created in django view
  try {
    const result = renderReact({ url, actions })
    res.json({ url, ...result })
  } catch (error) {
    res.json({ url, error: serializeError(error) })
  }
}

const nodeTree = (req, res) => {
  const data = buildNodeTree(req.body)
  res.json(data)
}

const cleanMarkup = (req, res) => {
  const data = R.pipe(
    R.prop('payload'),
    parseText,
    renderText,
    R.objOf('payload'),
  )(req.body)
  res.json(data)
}

// 404 not found
const notFound = (req, res) => {
  res.status(404).json({})
}

// main express server function
const serve = () => {
  const PORT = process.env.NODE_PORT || 9000
  const app = express()
  app.use(express.json({ limit: '10mb' }))
  app.set('json spaces', 2)
  app.use(morgan('dev'))
  app.use('/render', renderUniversitas)
  app.use('/markup', cleanMarkup)
  app.use('/nodetree', nodeTree)
  app.use('*', notFound)
  app.listen(PORT, () => console.log(`listening on port ${PORT}`))
}

serve()
