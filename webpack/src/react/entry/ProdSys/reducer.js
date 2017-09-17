import { combineReducers } from 'redux'
import { modelReducer } from 'ducks/basemodel'
import { reducer as stories } from 'stories/duck'
import { reducer as storytypes } from 'storytypes/duck'
import { reducer as auth } from 'auth/duck'
import { reducer as errors } from 'error/duck'

export default {
  auth,
  stories,
  storytypes,
  errors,
  issues: modelReducer('issues'),
  contributors: modelReducer('contributors'),
  images: modelReducer('images'),
}
