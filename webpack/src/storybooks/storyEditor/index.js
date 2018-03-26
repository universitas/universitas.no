/* eslint-env browser */
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './configureStore'
import Editor from 'containers/Editor'
import EditorPreview from 'components/EditorPreview'
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
