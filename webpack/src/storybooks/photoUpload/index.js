/* eslint-env browser */
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './configureStore'
import UploadWidget from './UploadWidget'

const App = () => (
  <section className="EditApp">
    <UploadWidget />
  </section>
)
const { store, persistor } = configureStore()

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <h1>photo upload</h1>
      <App />
    </PersistGate>
  </Provider>
)
