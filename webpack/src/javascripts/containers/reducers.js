// action creator
import { SELECT_IMAGE, RECEIVE_IMAGE_FILE } from './actions'
import { image } from '../components/CropBox/reducers'
import { combineReducers } from 'redux'

const selectedImage = (state = '', action) => {
  switch (action.type) {
  case SELECT_IMAGE:
    return action.payload.id
  default:
    return state
  }
}

const images = (state = {}, action) => {
  if (action.payload && action.payload.id) {
    const id = action.payload.id
    const imgState = image(state[id], action)
    if (imgState) {
      return { ...state, [id]: imgState }
    }
  }
  return state
}

export default combineReducers({ selectedImage, images })


