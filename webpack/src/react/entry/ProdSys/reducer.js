import { combineReducers } from 'redux'

// import { reducer as ui } from 'ducks/ui'
//
const dummyReducer = (state = { hello: 'world!!!', ui: {} }, action) => state

export default combineReducers({ dummyReducer })
