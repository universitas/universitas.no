import R from 'ramda'
import { combineReducers } from 'redux'
import { getImage } from 'ducks/images'
import { reducer as cropWidget } from 'ducks/cropWidget'
import { reducer as cropPanel } from 'ducks/cropPanel'
import { reducer as imageList } from 'ducks/imageList'

// Selectors
export const getUi = R.prop('ui')

// Action creators
export const IMAGE_SELECTED = 'ui/IMAGE_SELECTED'
export const imageSelected = image => ({
  type: IMAGE_SELECTED,
  payload: image,
})

export const IMAGE_CLICKED = 'ui/IMAGE_CLICKED'
export const imageClicked = id => ({
  type: IMAGE_CLICKED,
  payload: { id },
})

// const selectImage = id => (dispatch, getState) => {
//   const image = getImage(getState(), id)
//   dispatch(imageSelected(image))
// }

// Reducers
export const reducer = combineReducers({
  cropPanel,
  cropWidget,
  imageList,
})
