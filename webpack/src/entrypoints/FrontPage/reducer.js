import { combineReducers } from 'redux'
import { modelReducer } from 'ducks/basemodel'

export default {
  frontpage: modelReducer('frontpage', {}),
}
