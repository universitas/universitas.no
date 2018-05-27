import { combineReducers } from 'redux'
import newsFeed from 'ducks/newsFeed'
import site from 'ducks/site'

export default combineReducers({ site, newsFeed })
