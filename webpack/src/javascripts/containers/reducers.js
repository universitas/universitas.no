// action creator
import { imageReducer } from '../components/CropBox/reducers'
import { cropWidget } from '../components/EditImage/reducers'
import { searchField, imageList } from '../components/PhotoList/reducers'
import { combineReducers } from 'redux'

const images = (state = {}, action) => {
  if (action.payload && action.payload.id) {
    const id = action.payload.id
    const imgState = imageReducer(state[id], action)
    if (imgState) {
      return { ...state, [id]: imgState }
    } else {
      console.log(imgState)
    }
  }
  return state
}

export default combineReducers({
  cropWidget,
  imageList,
  searchField,
  images,
})
