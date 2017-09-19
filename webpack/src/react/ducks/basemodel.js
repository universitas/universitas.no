import { combinedToggle, partialMap } from '../utils/fp'
export const ITEM_ADDED = 'model/ITEM_ADDED'
export const ITEM_SELECTED = 'model/ITEM_SELECTED'
export const ITEM_CLONED = 'model/ITEM_CLONED'
export const ITEM_PATCHED = 'model/ITEM_PATCHED'
export const FIELD_CHANGED = 'model/FIELD_CHANGED'
export const ITEMS_FETCHED = 'model/ITEMS_FETCHED'
export const ITEM_REQUESTED = 'model/ITEM_REQUESTED'
export const ITEMS_REQUESTED = 'model/ITEMS_REQUESTED'
export const FILTER_TOGGLED = 'model/FILTER_TOGGLED'
export const FILTER_SET = 'model/FILTER_SET'

// Lenses
const currentItemLens = R.lensProp('currentItem')
const currentItemsLens = R.lensProp('currentItems')
const queryLens = R.lensProp('query')
const itemsLens = R.lensProp('items')
const navigationLens = R.lensProp('navigation')
const itemLens = id => R.lensPath(['items', String(id)])

// Lens for accessing model name from action
export const actionModelLens = R.lensPath(['meta', 'modelName'])

// :: Lens -> ModelName (String) -> State (Object) -> Any -- (create redux selector)
const getSelector = R.curryN(3, (lens, modelName, state) =>
  R.view(R.compose(R.lensProp(modelName), lens), state)
)
const defaultSelector = fallback =>
  R.curryN(3, R.pipe(getSelector, R.defaultTo(fallback)))

// :: modelName => {k: selector} -- (redux selector factory)
export const modelSelectors = partialMap({
  getQuery: getSelector(queryLens),
  getNavigation: getSelector(navigationLens),
  getItemList: getSelector(currentItemsLens),
  getItems: getSelector(itemsLens),
  getCurrentItemId: getSelector(currentItemLens),
  getItem: modelName => id => defaultSelector({})(itemLens(id), modelName),
  getCurrentItem: modelName => state =>
    defaultSelector({})(
      itemLens(getSelector(currentItemLens, modelName, state)),
      modelName,
      state
    ),
})

// :: ActionType -> ( * -> Payload ) -> ModelName -> ActionCreator (fn)
// -- (create redux action creator)
const getActionCreator = R.curry((type, payloadTransform, modelName) =>
  R.pipe(
    R.curry(payloadTransform),
    R.objOf('payload'),
    R.assoc('type', type),
    R.set(actionModelLens, modelName)
  )
)
// :: modelName => {k: actionCreator} -- (redux action creators factory)
export const modelActions = partialMap({
  itemAdded: getActionCreator(ITEM_ADDED, data => data),
  itemCloned: getActionCreator(ITEM_CLONED, id => ({ id })),
  itemSelected: getActionCreator(ITEM_SELECTED, id => ({ id })),
  itemDeSelected: getActionCreator(ITEM_SELECTED, R.always({ id: 0 })),
  itemPatched: getActionCreator(ITEM_PATCHED, response => ({
    dirty: false,
    ...response,
  })),
  fieldChanged: getActionCreator(FIELD_CHANGED, (id, field, value) => ({
    id,
    field,
    value,
  })),
  itemRequested: getActionCreator(ITEM_REQUESTED, id => ({ id })),
  itemsRequested: getActionCreator(ITEMS_REQUESTED, url => ({ url })),
  itemsFetched: getActionCreator(ITEMS_FETCHED, data => data),
  filterToggled: getActionCreator(FILTER_TOGGLED, (key, value) => ({
    key,
    value,
  })),
  filterSet: getActionCreator(FILTER_SET, (key, value) => ({ key, value })),
})

// :: Url -> Int -- ( Extract pagination offset from DRF url with url attributes )
const offsetFromUrl = R.compose(
  R.defaultTo(0),
  parseInt,
  R.prop(1),
  R.match(/(?:offset=)(\d+)/),
  R.defaultTo('')
)

// :: () => State
export const baseInitialState = R.pipe(
  R.always({}),
  R.set(currentItemLens, 0),
  R.set(currentItemsLens, []),
  R.set(itemsLens, {}),
  R.set(queryLens, {}),
  R.set(navigationLens, {})
)

// :: Action -> State -> State -- (pointfree redux reducer)
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

// :: (String, State) -> (Action -> State -> State) -- (redux reducer factory)
export const modelReducer = (modelName, modelState = {}) => {
  const initialState = R.mergeDeepRight(baseInitialState(), modelState)
  const isModelAction = R.pipe(R.view(actionModelLens), R.equals(modelName))
  return (state = initialState, action) =>
    R.ifElse(isModelAction, getReducer, R.always(R.identity))(action)(state)
}
