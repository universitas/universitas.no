import R from 'ramda' // Action constants
export const ITEM_ADDED = 'issues/ITEM_ADDED'
export const ITEM_SELECTED = 'issues/ITEM_SELECTED'
export const ITEM_PATCHED = 'issues/ITEM_PATCHED'
export const ITEMS_FETCHED = 'issues/ITEMS_FETCHED'
export const ITEM_REQUESTED = 'issues/ITEM_REQUESTED'
export const ITEMS_REQUESTED = 'issues/ITEMS_REQUESTED'

// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const currentItemLens = lens('currentItem')
const currentItemsLens = lens('currentItems')
const urlLens = lens('url')
const queryLens = lens('query')
const itemsLens = lens('items')
const itemLens = id => R.lensPath(['items', id])
// const itemLens = R.pipe(R.flip(R.append)(['items']), R.lensPath)

// Selectors
const selectorFromLens = l => R.view(R.compose(lens('issues'), l))

export const getIssueList = selectorFromLens(currentItemsLens)
export const getCurrentIssue = selectorFromLens(currentItemLens)
export const getUrl = selectorFromLens(urlLens)
export const getQuery = selectorFromLens(queryLens)
export const getIssue = id => selectorFromLens(itemLens(id))

// Action creators
export const issueAdded = data => ({
  type: ITEM_ADDED,
  payload: data,
})
export const issueSelected = id => ({
  type: ITEM_SELECTED,
  payload: { id },
})
export const issueDeSelected = () => ({
  type: ITEM_SELECTED,
  payload: { id: 0 },
})
export const issuePatched = data => ({
  type: ITEM_PATCHED,
  payload: data,
})
export const issueRequested = id => ({
  type: ITEM_REQUESTED,
  payload: { id },
})
export const issuesRequested = () => ({
  type: ITEMS_REQUESTED,
})
export const issuesFetched = data => ({
  type: ITEMS_FETCHED,
  payload: data,
})

// reducers
export const initialState = R.pipe(
  R.set(urlLens, '/api/issues'),
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
    case ITEM_ADDED:
      return R.set(itemLens(payload.id), payload)
    case ITEM_SELECTED:
      return R.set(currentItemLens, payload.id)
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
