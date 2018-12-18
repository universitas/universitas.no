// base model for prodsys
import { parseQuery } from 'utils/urls'
import { arrayToggle, combinedToggle, partialMap } from 'utils/fp'
export const AUTOSAVE_TOGGLE = 'model/AUTOSAVE_TOGGLE'
export const ITEM_ADDED = 'model/ITEM_ADDED'
export const ITEM_CLONED = 'model/ITEM_CLONED'
export const ITEM_DELETED = 'model/ITEM_DELETED'
export const ITEM_CREATED = 'model/ITEM_CREATED'
export const ITEM_CREATE_FAILED = 'model/ITEM_CREATE_FAILED'
export const ITEMS_DISCARDED = 'model/ITEMS_DISCARDED'
export const ITEM_PATCH = 'model/ITEM_PATCH'
export const ITEM_PATCHED = 'model/ITEM_PATCHED'
export const ITEM_PATCH_FAILED = 'model/ITEM_PATCH_FAILED'
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
const autosaveLens = R.lensProp('autosave')
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

const getItem = (modelName, id, state) => {
  const item = R.view(R.lensPath([modelName, 'items', '' + id]), state)
  return R.cond([
    [R.isNil, R.always({})],
    [
      R.propSatisfies(R.complement(R.isEmpty), 'dirty'),
      R.converge(R.mergeLeft, [R.prop('dirty'), R.dissoc('dirty')]),
    ],
    [R.T, R.identity],
  ])(item)
}

const getDirty = (modelName, id) =>
  R.view(R.lensPath([modelName, 'items', id, 'dirty']))

// :: modelName -> {k: selector} -- (redux selector factory)
export const modelSelectors = partialMap({
  getQuery: getSelector(queryLens),
  getPagination: getSelector(paginationLens),
  getItemList: getSelector(paginationItemsLens),
  getItems: getSelector(itemsLens),
  getFetching: getSelector(fetchingLens),
  getAutosave: getSelector(autosaveLens),
  getItem: R.curryN(3, getItem),
  getDirty: R.curryN(2, getDirty),
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
  autosaveToggle: getActionCreator(AUTOSAVE_TOGGLE, R.always({})),
  itemAdded: getActionCreator(ITEM_ADDED, data => data),
  itemCloned: getActionCreator(ITEM_CLONED, id => ({ id })),
  itemDeleted: getActionCreator(ITEM_DELETED, id => ({ id })),
  itemCreated: getActionCreator(ITEM_CREATED, data => data),
  itemCreateFailed: getActionCreator(ITEM_CREATE_FAILED, error => error),
  itemsDiscarded: getActionCreator(ITEMS_DISCARDED, (...ids) => ({ ids })),
  itemPatch: getActionCreator(ITEM_PATCH, (id, patch) => ({ id, patch })),
  itemPatched: getActionCreator(ITEM_PATCHED, data => data),
  itemPatchFailed: getActionCreator(ITEM_PATCH_FAILED, error => error),
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
  R.set(autosaveLens, true),
)

const updateItems = R.converge(R.call, [
  R.ifElse(R.prop('replace'), R.always(R.mergeLeft), R.always(R.mergeDeepLeft)),
  R.pipe(
    R.prop('results'),
    R.indexBy(R.prop('id')),
    R.map(R.assoc('status', 'ok')),
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
          count,
          last: offsetFromUrl(next) || offsetFromUrl(url) + results.length,
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
    case ITEM_PATCH:
      return R.over(itemLens(payload.id), R.assoc('status', 'syncing'))
    case ITEM_PATCHED:
      // received single item patch from server
      return R.over(
        itemLens(payload.id),
        R.pipe(
          R.mergeDeepLeft(payload),
          R.mergeLeft({ status: 'ok', error: null, dirty: {} }),
        ),
      )
    case ITEM_PATCH_FAILED:
      return R.over(
        itemLens(payload.id),
        R.mergeLeft({ status: 'error', error: payload }),
      )
    case ITEM_CREATED:
      // new item created
      return R.compose(
        R.set(itemLens(0), {}),
        R.set(itemLens(payload.id), payload),
        R.over(paginationItemsLens, R.union([payload.id])),
      )
    case ITEM_CREATE_FAILED:
      return R.over(itemLens(0), R.assoc('error', payload))
    case ITEM_ADDED:
      // received single new item
      return R.compose(
        R.set(itemLens(payload.id), payload),
        R.over(paginationItemsLens, R.union([payload.id])),
      )
    case FIELD_CHANGED: {
      // single item field changed client side
      const { id, field, value } = payload
      const mergeData = { status: 'dirty', dirty: { [field]: value } }
      return R.over(itemLens(id), R.mergeDeepLeft(mergeData))
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
    case AUTOSAVE_TOGGLE:
      return R.over(autosaveLens, R.not)
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
