import React from 'react'
import { Provider } from 'react-redux'
import configureStore from 'store'
import 'styles/prodsys.scss'

const App = () => (
  <section className="ProdSys">
    <h1>Prodsys</h1>
  </section>
)

export default () => (
  <Provider store={configureStore()}>
    <App />
  </Provider>
)
