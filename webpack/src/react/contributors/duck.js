import { objectToggle } from '../utils/fp'
export const ITEM_ADDED = 'contributors/ITEM_ADDED'
export const ITEM_SELECTED = 'contributors/ITEM_SELECTED'
export const ITEM_PATCHED = 'contributors/ITEM_PATCHED'
export const FIELD_CHANGED = 'contributors/FIELD_CHANGED'
export const ITEMS_FETCHED = 'contributors/ITEMS_FETCHED'
export const ITEM_REQUESTED = 'contributors/ITEM_REQUESTED'
export const ITEMS_REQUESTED = 'contributors/ITEMS_REQUESTED'
export const FILTER_TOGGLED = 'contributors/FILTER_TOGGLED'

// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const currentItemLens = lens('currentItem')
const currentItemsLens = lens('currentItems')
const queryLens = lens('query')
const itemsLens = lens('items')
const itemLens = id => R.lensPath(['items', String(id)])

// Selectors
const selectorFromLens = l => R.view(R.compose(lens('contributors'), l))

export const getContributorList = selectorFromLens(currentItemsLens)
export const getCurrentContributorId = selectorFromLens(currentItemLens)
export const getQuery = selectorFromLens(queryLens)
export const getContributor = id => selectorFromLens(itemLens(id))

export const getCurrentContributor = state =>
  getContributor(getCurrentContributorId(state))(state)

// Action creators
export const contributorAdded = data => ({
  type: ITEM_ADDED,
  payload: data,
})
export const contributorSelected = id => ({
  type: ITEM_SELECTED,
  payload: { id },
})
export const contributorDeSelected = () => ({
  type: ITEM_SELECTED,
  payload: { id: 0 },
})
export const contributorPatched = ({ response }) => ({
  type: ITEM_PATCHED,
  payload: { dirty: false, ...response },
})
export const fieldChanged = (id, field, value) => ({
  type: FIELD_CHANGED,
  payload: { id, field, value },
})
export const contributorRequested = id => ({
  type: ITEM_REQUESTED,
  payload: { id },
})
export const contributorsRequested = () => ({
  type: ITEMS_REQUESTED,
})
export const contributorsFetched = data => ({
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
  R.set(queryLens, {})
)({})

const getReducer = ({ type, payload }) => {
  switch (type) {
    case ITEMS_FETCHED: {
      const ids = R.pluck('id', payload.results)
      const items = R.zipObj(ids, payload.results)
      return R.compose(
        R.over(itemsLens, R.merge(items)),
        R.set(currentItemsLens, ids)
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
