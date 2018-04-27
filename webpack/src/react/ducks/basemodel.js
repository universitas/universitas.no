// base model for prodsys
import { parseQuery } from 'utils/urls'
import { arrayToggle, combinedToggle, partialMap } from 'utils/fp'
export const ITEM_ADDED = 'model/ITEM_ADDED'
export const ITEM_SELECTED = 'model/ITEM_SELECTED'
export const REVERSE_URL = 'model/REVERSE_URL'
export const ITEM_SELECT_TOGGLED = 'model/ITEM_SELECT_TOGGLE'
export const ITEM_CLONED = 'model/ITEM_CLONED'
export const ITEMS_DISCARDED = 'model/ITEMS_DISCARDED'
export const ITEM_PATCHED = 'model/ITEM_PATCHED'
export const FIELD_CHANGED = 'model/FIELD_CHANGED'
export const ITEMS_FETCHED = 'model/ITEMS_FETCHED'
export const ITEMS_APPENDED = 'model/ITEMS_APPENDED'
export const ITEM_REQUESTED = 'model/ITEM_REQUESTED'
export const ITEMS_REQUESTED = 'model/ITEMS_REQUESTED'
export const FILTER_TOGGLED = 'model/FILTER_TOGGLED'
export const FILTER_SET = 'model/FILTER_SET'

// Lenses
const selectedItemsLens = R.lensProp('selection')
const selectedItemLens = R.lensPath(['selection', 0])
const currentItemsLens = R.lensProp('listItems')
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
  getCurrentItemId: getSelector(selectedItemLens),
  getItem: modelName => id => defaultSelector({})(itemLens(id), modelName),
  getCurrentItem: modelName => state =>
    defaultSelector({})(
      itemLens(getSelector(selectedItemLens, modelName, state)),
      modelName,
      state
    ),
  getChoices: R.pipe(
    getSelector(itemsLens),
    R.values,
    R.map(({ id, name }) => ({ value: id, display_name: name }))
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
  reverseUrl: getActionCreator(REVERSE_URL, R.identity),
  itemAdded: getActionCreator(ITEM_ADDED, data => data),
  itemCloned: getActionCreator(ITEM_CLONED, id => ({ id })),
  itemSelected: getActionCreator(ITEM_SELECTED, id => ({ id })),
  itemSelectToggled: getActionCreator(ITEM_SELECT_TOGGLED, id => ({ id })),
  itemsDiscarded: getActionCreator(ITEMS_DISCARDED, ids => ({ ids })),
  itemPatched: getActionCreator(ITEM_PATCHED, R.assoc('dirty', false)),
  itemRequested: getActionCreator(ITEM_REQUESTED, id => ({ id })),
  itemsRequested: getActionCreator(ITEMS_REQUESTED, params => ({ params })),
  itemsFetched: getActionCreator(ITEMS_FETCHED, data => data),
  itemsAppended: getActionCreator(ITEMS_APPENDED, data => data),
  filterSet: getActionCreator(FILTER_SET, (key, value) => ({ key, value })),
  filterToggled: getActionCreator(FILTER_TOGGLED, (key, value) => ({
    key,
    value,
  })),
  fieldChanged: getActionCreator(FIELD_CHANGED, (id, field, value) => ({
    id,
    field,
    value,
  })),
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
  R.set(selectedItemLens, 0),
  R.set(currentItemsLens, []),
  R.set(itemsLens, {}),
  R.set(queryLens, {}),
  R.set(navigationLens, {})
)

// :: Action -> State -> State -- (pointfree redux reducer)
const getReducer = ({ type, payload }) => {
  switch (type) {
    case ITEMS_FETCHED: {
      // items fetched and pagination updated
      const { results, next, previous, count, url } = payload
      return R.compose(
        R.over(itemsLens, R.merge(R.indexBy(R.prop('id'), results))),
        R.set(currentItemsLens, R.pluck('id', results)),
        R.set(navigationLens, {
          results: results.length,
          last: offsetFromUrl(next) || offsetFromUrl(url) + results.length,
          count,
          next: next && parseQuery(next),
          previous: previous && parseQuery(previous),
        })
      )
    }
    case ITEMS_APPENDED:
      // items fetched, but no change in selection (current pagination)
      return R.over(
        itemsLens,
        R.merge(R.indexBy(R.prop('id'), payload.results))
      )
    case ITEMS_DISCARDED:
      return R.over(currentItemsLens, R.without(payload.ids))
    case ITEM_PATCHED:
      // received single item patch from server
      return R.set(itemLens(payload.id), payload)
    case ITEM_ADDED:
      // received single new item
      return R.compose(
        R.over(currentItemsLens, R.union([payload.id])),
        R.set(itemLens(payload.id), payload)
      )
    case FIELD_CHANGED: {
      // single item field changed client side
      const { id, field, value } = payload
      const mergeData = { dirty: true, [field]: value }
      const lens = itemLens(id)
      return R.over(lens, R.mergeDeepLeft(mergeData))
    }
    case ITEM_SELECTED:
      // select single item
      return R.set(selectedItemsLens, [payload.id])
    case ITEM_SELECT_TOGGLED:
      return R.over(selectedItemsLens, arrayToggle(payload.id))
    case FILTER_SET:
      // set single filter value
      return R.set(R.compose(queryLens, R.lensProp(payload.key)), payload.value)
    case FILTER_TOGGLED:
      // flip single filter value ( also works with filter-set )
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
