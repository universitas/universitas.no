import R from 'ramda' // Action constants
import { objectToggle } from '../utils/fp'
export const ITEM_ADDED = 'photos/ITEM_ADDED'
export const ITEM_SELECTED = 'photos/ITEM_SELECTED'
export const ITEM_PATCHED = 'photos/ITEM_PATCHED'
export const FIELD_CHANGED = 'photos/FIELD_CHANGED'
export const ITEMS_FETCHED = 'photos/ITEMS_FETCHED'
export const ITEM_REQUESTED = 'photos/ITEM_REQUESTED'
export const ITEMS_REQUESTED = 'photos/ITEMS_REQUESTED'
export const FILTER_TOGGLED = 'photos/FILTER_TOGGLED'

// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const currentItemLens = lens('currentItem')
const currentItemsLens = lens('currentItems')
const queryLens = lens('query')
const itemsLens = lens('items')
const navigationLens = lens('navigation')
const itemLens = id => R.lensPath(['items', String(id)])

// Selectors
const selectorFromLens = l => R.view(R.compose(lens('photos'), l))

export const getPhotoList = selectorFromLens(currentItemsLens)
export const getCurrentPhotoId = selectorFromLens(currentItemLens)
export const getQuery = selectorFromLens(queryLens)
export const getNavigation = selectorFromLens(navigationLens)
export const getPhoto = id => selectorFromLens(itemLens(id))

export const getCurrentPhoto = state =>
  getPhoto(getCurrentPhotoId(state))(state)

// Action creators
export const photoAdded = data => ({
  type: ITEM_ADDED,
  payload: data,
})
export const photoSelected = id => ({
  type: ITEM_SELECTED,
  payload: { id },
})
export const photoDeSelected = () => ({
  type: ITEM_SELECTED,
  payload: { id: 0 },
})
export const photoPatched = ({ response }) => ({
  type: ITEM_PATCHED,
  payload: { dirty: false, ...response },
})
export const fieldChanged = (id, field, value) => ({
  type: FIELD_CHANGED,
  payload: { id, field, value },
})
export const photoRequested = id => ({
  type: ITEM_REQUESTED,
  payload: { id },
})
export const photosRequested = url => ({
  type: ITEMS_REQUESTED,
  payload: { url },
})
export const photosFetched = data => ({
  type: ITEMS_FETCHED,
  payload: data,
})
export const filterToggled = (key, value) => ({
  type: FILTER_TOGGLED,
  payload: { key, value },
})

// reducers
export const initialState = R.pipe(
  R.set(currentItemLens, 0),
  R.set(currentItemsLens, []),
  R.set(queryLens, {}),
  R.set(navigationLens, {})
)({})

const getReducer = ({ type, payload }) => {
  switch (type) {
    case ITEMS_FETCHED: {
      const { results, next, previous, count } = payload
      const ids = R.pluck('id', results)
      const items = R.zipObj(ids, results)
      return R.compose(
        R.over(itemsLens, R.merge(items)),
        R.set(currentItemsLens, ids),
        R.set(navigationLens, {
          results: results.length,
          count,
          next,
          previous,
        })
      )
    }
    case ITEM_PATCHED:
      return R.set(itemLens(payload.id), payload)
    case ITEM_ADDED:
      return R.compose(
        R.over(currentItemsLens, R.union([payload.id])),
        R.set(itemLens(payload.id), payload)
      )
    case FIELD_CHANGED: {
      const { id, field, value } = payload
      const mergeData = { dirty: true, [field]: value }
      const lens = itemLens(id)
      return R.over(lens, R.mergeDeepLeft(mergeData))
      // return R.set(itemLens(id), mergeData)
    }
    case ITEM_SELECTED:
      return R.set(currentItemLens, payload.id)
    case FILTER_TOGGLED: {
      return R.over(queryLens, objectToggle(payload.key, payload.value))
    }
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
