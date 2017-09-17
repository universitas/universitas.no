import { combinedToggle } from '../utils/fp'
export const ITEM_ADDED = 'modelName/ITEM_ADDED'
export const ITEM_SELECTED = 'modelName/ITEM_SELECTED'
export const ITEM_CLONED = 'modelName/ITEM_CLONED'
export const ITEM_PATCHED = 'modelName/ITEM_PATCHED'
export const FIELD_CHANGED = 'modelName/FIELD_CHANGED'
export const ITEMS_FETCHED = 'modelName/ITEMS_FETCHED'
export const ITEM_REQUESTED = 'modelName/ITEM_REQUESTED'
export const ITEMS_REQUESTED = 'modelName/ITEMS_REQUESTED'
export const FILTER_TOGGLED = 'modelName/FILTER_TOGGLED'
export const FILTER_SET = 'modelName/FILTER_SET'

// Lenses
const currentItemLens = R.lensProp('currentItem')
const currentItemsLens = R.lensProp('currentItems')
const queryLens = R.lensProp('query')
const itemsLens = R.lensProp('items')
const navigationLens = R.lensProp('navigation')
const itemLens = id => R.lensPath(['items', String(id)])

const modelLens = R.lensPath(['meta', 'modelName'])

// Selectors
const getSelector = R.curry((lens, modelName) =>
  R.view(R.compose(R.lensPath(modelName), lens))
)

// Action creators
const getActionCreator = R.curryN(3, (type, payloadTransform, modelName) =>
  R.pipe(
    payloadTransform,
    R.objOf('payload'),
    R.assoc('type', type),
    R.set(modelLens, modelName)
  )
)

const selectors = {
  getItemList: getSelector(currentItemsLens),
  getCurrentItemId: getSelector(currentItemLens),
  getCurrentItem: modelName => state =>
    getSelector(itemLens(getSelector(currentItemLens)(state)), modelName)(
      state
    ) || {},
  getQuery: getSelector(queryLens),
  getNavigation: getSelector(navigationLens),
  getItem: id => getSelector(itemLens(id)),
}

const actionCreators = {
  itemAdded: getActionCreator(ITEM_ADDED, data => data),
  itemCloned: getActionCreator(ITEM_CLONED, id => ({ id })),
  itemSelected: getActionCreator(ITEM_SELECTED, id => ({ id })),
  itemDeSelected: getActionCreator(ITEM_SELECTED, R.always({ id: 0 })),
  itemPatched: getActionCreator(ITEM_PATCHED, response => ({
    dirty: false,
    ...response,
  })),
  fieldChanged: getActionCreator(
    FIELD_CHANGED,
    R.curryN(3, (id, field, value) => ({ id, field, value }))
  ),
  itemRequested: getActionCreator(ITEM_REQUESTED, id => ({ id })),
  itemsRequested: getActionCreator(ITEMS_REQUESTED, url => ({ url })),
  itemsFetched: getActionCreator(ITEMS_FETCHED, data => data),
  filterToggled: getActionCreator(FILTER_TOGGLED, (key, value) => ({
    key,
    value,
  })),
  filterSet: getActionCreator(FILTER_SET, (key, value) => ({ key, value })),
}

// reducers
const offsetFromUrl = R.compose(
  R.defaultTo(0),
  parseInt,
  R.prop(1),
  R.match(/(?:offset=)(\d+)/),
  R.defaultTo('')
)

const getReducer = ({ type, payload }) => {
  switch (type) {
    case ITEMS_FETCHED: {
      const { results, next, previous, count, url } = payload
      const ids = R.pluck('id', results)
      const items = R.zipObj(ids, results)
      return R.compose(
        R.over(itemsLens, R.merge(items)),
        R.set(currentItemsLens, ids),
        R.set(navigationLens, {
          results: results.length,
          last: offsetFromUrl(next) || offsetFromUrl(url) + results.length,
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
    case FILTER_SET:
      return R.set(R.compose(queryLens, R.lensProp(payload.key)), payload.value)
    case FILTER_TOGGLED:
      return R.over(queryLens, combinedToggle(payload.key, payload.value))

    default:
      return R.identity
  }
}

export const baseInitialState = R.pipe(
  R.always({}),
  R.set(currentItemLens, 0),
  R.set(currentItemsLens, []),
  R.set(queryLens, {}),
  R.set(navigationLens, {})
)

export const modelReducer = (modelName, initialState = {}) => {
  const mergedState = R.mergeDeepRight(baseInitialState(), initialState)
  return (state = mergedState, action) =>
    R.view(modelLens, action) !== modelName ? state : getReducer(action)(state)
}

export const modelActions = modelName => R.applySpec(actionCreators)(modelName)
export const modelSelectors = modelName => R.applySpec(selectors)(modelName)
