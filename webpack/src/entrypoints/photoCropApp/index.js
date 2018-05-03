/* eslint-env browser */
import { Provider } from 'react-redux'
import { combineReducers } from 'redux'

import configureStore from './configureStore'
import App from './App'
import { reducer as ui } from 'x/ducks/cropWidgetUi'
import { reducer as images } from 'x/ducks/images'

const rootReducer = combineReducers({ ui, images })
const rootStore = configureStore(rootReducer)

export default () => (
  <Provider store={rootStore}>
    <App />
  </Provider>
)
