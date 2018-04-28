import { modelActions, modelReducer, modelSelectors } from './basemodel'

const MODEL = 'photos'

// actions
export const { photoAdded: itemAdded } = modelSelectors(SLICE)
// selectors
export const {
  getPhotos: getItems,
  getPhotoList: getItemList,
  getPhoto: getItem,
  getCurrentPhoto: getCurrentItem,
} = modelSelectors(SLICE)
