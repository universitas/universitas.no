import { combineReducers } from 'redux'
import { modelReducer } from 'ducks/basemodel'
import { reducer as fileupload } from 'ducks/fileupload'
import { reducer as auth } from 'ducks/auth'
import { reducer as errors } from 'ducks/error'

const storiesInitialState = {
  query: {
    search: '',
    limit: 25,
    publication_status__in: [3, 4, 5, 6, 7],
    order_by: ['publication_status', '-modified'],
  },
}
const issuesInitialState = {
  query: {
    search: '',
    limit: 40,
    ordering: 'publication_date',
    publication_date__year: new Date().getFullYear(),
  },
}
const contributorsInitialState = {
  query: {
    search: '',
    limit: 25,
    status: 1,
  },
}
const photosInitialState = {
  query: {
    search: '',
    limit: 16,
  },
}
export default {
  auth,
  errors,
  fileupload,
  storytypes: modelReducer('storytypes'),
  stories: modelReducer('stories', storiesInitialState),
  issues: modelReducer('issues', issuesInitialState),
  contributors: modelReducer('contributors', contributorsInitialState),
  photos: modelReducer('photos', photosInitialState),
}
