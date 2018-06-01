import { combineReducers } from 'redux'
import newsFeed from 'ducks/newsFeed'
import site from 'ducks/site'
import { reducer as menu } from 'ducks/menu'

export default combineReducers({ newsFeed, site, menu })
