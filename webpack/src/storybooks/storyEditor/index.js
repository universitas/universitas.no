/* eslint-env browser */
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './configureStore'
import Editor from 'x/components/Editor'
import EditorPreview from 'x/components/EditorPreview'
import 'styles/editorapp.scss'

const App = () => (
  <section className="EditApp">
    <Editor />
    <EditorPreview />
  </section>
)
const { store, persistor } = configureStore()

export default () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
)
