/* eslint-env browser */
import { combineReducers } from 'redux'
import { Provider } from 'react-redux'

import { imageClicked, reducer as ui } from 'x/ducks/cropWidgetUi'
import { reducer as images } from 'x/ducks/images'

import configureStore from '../photoCropApp/configureStore'
import App from './App'

const rootReducer = combineReducers({ ui, images })
const rootStore = configureStore(rootReducer)

export const FrontPageCrop = () => (
  <Provider store={rootStore}>
    <App />
  </Provider>
)
// selects another image
export const imageClickHandler = id => {
  rootStore.dispatch(imageClicked(id))
}
