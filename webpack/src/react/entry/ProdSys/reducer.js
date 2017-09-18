import { combineReducers } from 'redux'
import { modelReducer } from 'ducks/basemodel'
import { reducer as auth } from 'auth/duck'
import { reducer as errors } from 'error/duck'

const storyInitialState = {
  query: {
    search: '',
    limit: 25,
    publication_status__in: [3, 4, 5, 6, 7],
    order_by: ['publication_status', '-modified'],
  },
}
export default {
  auth,
  errors,
  stories: modelReducer('stories', storyInitialState),
  storytypes: modelReducer('storytypes'),
  issues: modelReducer('issues'),
  contributors: modelReducer('contributors'),
  images: modelReducer('images'),
}
