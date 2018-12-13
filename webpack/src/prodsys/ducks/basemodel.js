// base model for prodsys
import { parseQuery } from 'utils/urls'
import { arrayToggle, combinedToggle, partialMap } from 'utils/fp'
export const ITEM_ADDED = 'model/ITEM_ADDED'
export const ITEM_CLONED = 'model/ITEM_CLONED'
export const ITEM_DELETED = 'model/ITEM_DELETED'
export const ITEM_CREATED = 'model/ITEM_CREATED'
export const ITEMS_DISCARDED = 'model/ITEMS_DISCARDED'
export const ITEM_PATCHED = 'model/ITEM_PATCHED'
export const FIELD_CHANGED = 'model/FIELD_CHANGED'
export const PAGINATE = 'model/PAGINATE'
export const ITEMS_FETCHED = 'model/ITEMS_FETCHED'
export const ITEMS_REQUESTED = 'model/ITEMS_REQUESTED'
export const ITEMS_FETCHING = 'model/ITEMS_FETCHING'
export const FILTER_TOGGLED = 'model/FILTER_TOGGLED'
export const FILTER_SET = 'model/FILTER_SET'

// Lenses
const queryLens = R.lensProp('query')
const itemsLens = R.lensProp('items')
const paginationLens = R.lensProp('pagination')
const paginationItemsLens = R.lensPath(['pagination', 'ids'])
const fetchingLens = R.lensProp('fetching')
const itemLens = id => R.lensPath(['items', String(id)])

// Lens for accessing model name from action
export const actionModelLens = R.lensPath(['meta', 'modelName'])

// :: Lens -> ModelName (String) -> State (Object) -> Any -- (create redux selector)
const getSelector = R.curryN(3, (lens, modelName, state) =>
  R.view(
    R.compose(
      R.lensProp(modelName),
      lens,
    ),
    state,
  ),
)
const defaultSelector = fallback =>
  R.curryN(
    3,
    R.pipe(
      getSelector,
      R.defaultTo(fallback),
    ),
  )

// :: modelName -> {k: selector} -- (redux selector factory)
export const modelSelectors = partialMap({
  getQuery: getSelector(queryLens),
  getPagination: getSelector(paginationLens),
  getItemList: getSelector(paginationItemsLens),
  getItems: getSelector(itemsLens),
  getFetching: getSelector(fetchingLens),
  getItem: modelName => id => defaultSelector({})(itemLens(id), modelName),
  getChoices: R.pipe(
    getSelector(itemsLens),
    R.values,
    R.map(({ id, name }) => ({ value: id, display_name: name })),
  ),
})

// :: ActionType -> ( * -> Payload ) -> ModelName -> ActionCreator (fn)
// -- (create redux action creator)
const getActionCreator = R.curry((type, payloadTransform, modelName) =>
  R.pipe(
    R.curry(payloadTransform),
    R.objOf('payload'), //               payload: payloadTransform(?)
    R.assoc('type', type), //            type: ACTION_TYPE
    R.set(actionModelLens, modelName), // meta: modelName
  ),
)
// :: modelName => {k: actionCreator} -- (redux action creators factory)
export const modelActions = partialMap({
  itemAdded: getActionCreator(ITEM_ADDED, data => data),
  itemCloned: getActionCreator(ITEM_CLONED, id => ({ id })),
  itemDeleted: getActionCreator(ITEM_DELETED, id => ({ id })),
  itemCreated: getActionCreator(ITEM_CREATED, data => data),
  itemsDiscarded: getActionCreator(ITEMS_DISCARDED, (...ids) => ({ ids })),
  itemPatched: getActionCreator(ITEM_PATCHED, R.assoc('dirty', false)),
  itemRequested: getActionCreator(
    ITEMS_REQUESTED,
    (id, params = {}, replace = false) => ({
      params: { id__in: [id], ...params },
      replace,
    }),
  ),
  itemsRequested: getActionCreator(
    ITEMS_REQUESTED,
    (params, replace = false) => ({ params, replace }),
  ),
  itemsFetching: getActionCreator(ITEMS_FETCHING, data => data),
  itemsFetched: getActionCreator(ITEMS_FETCHED, data => data),
  paginate: getActionCreator(PAGINATE, data => data),
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
  R.defaultTo(''),
)

// :: () => State
export const baseInitialState = R.pipe(
  R.always({}),
  R.set(itemsLens, {}),
  R.set(queryLens, {}),
  R.set(paginationLens, {}),
  R.set(paginationItemsLens, []),
)

const updateItems = R.converge(R.call, [
  R.ifElse(R.prop('replace'), R.always(R.mergeLeft), R.always(R.mergeDeepLeft)),
  R.pipe(
    R.prop('results'),
    R.indexBy(R.prop('id')),
  ),
])

// :: Action -> State -> State -- (pointfree redux reducer)
const getReducer = ({ type, payload }) => {
  switch (type) {
    case PAGINATE: {
      // items fetched and pagination updated
      const { results, next, previous, count, url } = payload
      return R.compose(
        R.set(paginationItemsLens, R.pluck('id', results)),
        R.set(paginationLens, {
          last: offsetFromUrl(next) || offsetFromUrl(url) + results.length,
          count,
          next: next && parseQuery(next),
          previous: previous && parseQuery(previous),
        }),
      )
    }
    case ITEMS_FETCHED:
      // items fetched, but no change in pagination
      return R.compose(
        R.set(fetchingLens, false),
        R.over(itemsLens, updateItems(payload)),
      )
    case ITEMS_DISCARDED: {
      const { ids = [] } = payload
      const deleted = R.pipe(
        R.map(k => [k, { deleted: true }]),
        R.fromPairs,
      )
      return R.compose(
        R.over(itemsLens, R.mergeDeepLeft(deleted(ids))),
        R.over(paginationItemsLens, R.without(ids)),
      )
    }
    case ITEM_PATCHED:
      // received single item patch from server
      return R.over(itemLens(payload.id), R.mergeDeepLeft(payload))
    case ITEM_ADDED:
      // received single new item
      return R.compose(
        R.set(itemLens(payload.id), payload),
        R.over(paginationItemsLens, R.union([payload.id])),
      )
    case FIELD_CHANGED: {
      // single item field changed client side
      const { id, field, value } = payload
      const mergeData = { dirty: true, [field]: value }
      const lens = itemLens(id)
      return R.over(lens, R.mergeDeepLeft(mergeData))
    }
    case ITEMS_FETCHING:
      return R.set(fetchingLens, true)
    case FILTER_SET:
      // set single filter value
      return R.set(
        R.compose(
          queryLens,
          R.lensProp(payload.key),
        ),
        payload.value,
      )
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
  const isModelAction = R.pipe(
    R.view(actionModelLens),
    R.equals(modelName),
  )
  return (state = initialState, action) =>
    R.ifElse(isModelAction, getReducer, R.always(R.identity))(action)(state)
}
