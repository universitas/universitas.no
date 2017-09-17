import { objectToggle } from '../utils/fp'
export const ITEMS_FETCHED = 'storyTypes/ITEMS_FETCHED'
export const ITEMS_REQUESTED = 'storyTypes/ITEMS_REQUESTED'

// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const itemsLens = lens('items')
const itemLens = id => R.lensPath(['items', String(id)])

// Selectors
const selectorFromLens = l => R.view(R.compose(lens('storytypes'), l))

export const getStoryType = id => selectorFromLens(itemLens(id))
export const getStoryTypes = selectorFromLens(itemsLens)
export const getStoryTypeList = R.pipe(getStoryTypes, R.values)

// Action creators
export const storyTypesRequested = () => ({
  type: ITEMS_REQUESTED,
})
export const storyTypesFetched = data => ({
  type: ITEMS_FETCHED,
  payload: data,
})

// reducers
const initialState = {}

const getReducer = ({ type, payload }) => {
  switch (type) {
    case ITEMS_FETCHED: {
      const ids = R.pluck('id', payload.results)
      const items = R.zipObj(ids, payload.results)
      return R.over(itemsLens, R.merge(items))
    }
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
