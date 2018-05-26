import { combineReducers } from 'redux'

const stories = (state = {}, action) => state
const site = (state = {}, action) => state

export default combineReducers({ stories, site })
