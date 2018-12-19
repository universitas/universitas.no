import { combineReducers } from 'redux'
import { reducer as ux } from 'ducks/ux'
import { reducer as auth } from 'ducks/auth'
import { reducer as errors } from 'ducks/error'
import { reducer as fileupload } from 'ducks/fileupload'
import { modelReducer } from 'ducks/basemodel'

const initialModelStates = {
  storytypes: {},
  positions: {},
  pages: {},
  storyimages: {},
  stories: {
    query: {
      search: '',
      limit: 25,
      publication_status__in: [3, 4, 5, 6, 7],
      order_by: ['publication_status', '-modified'],
    },
  },
  issues: {
    query: {
      search: '',
      limit: 40,
      ordering: 'publication_date',
      publication_date__year: new Date().getFullYear(),
    },
  },
  contributors: {
    query: { search: '', limit: 50, status: 1 },
    items: { 0: { status: 1, first_position: 26 } },
  },
  photos: { query: { search: '', limit: 16 } },
  frontpage: { query: { language: 'nor' } },
}

export default {
  ux,
  auth,
  errors,
  fileupload,
  ...R.mapObjIndexed(R.flip(modelReducer), initialModelStates),
}
