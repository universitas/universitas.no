// base model for prodsys
import { parseQuery } from 'utils/urls'
import { arrayToggle, combinedToggle, partialMap } from 'utils/fp'
export const ITEM_ADDED = 'model/ITEM_ADDED'
export const ITEM_CLONED = 'model/ITEM_CLONED'
export const ITEM_DELETED = 'model/ITEM_DELETED'
export const ITEM_POST = 'model/ITEM_POST'
export const ITEM_CREATED = 'model/ITEM_CREATED'
export const ITEM_CREATE_FAILED = 'model/ITEM_CREATE_FAILED'
export const ITEMS_DISCARDED = 'model/ITEMS_DISCARDED'
export const ITEM_SAVE = 'model/ITEM_SAVE'
export const ITEM_PATCH_START = 'model/ITEM_PATCH_START'
export const ITEM_PATCH_SUCCESS = 'model/ITEM_PATCH_SUCCESS'
export const ITEM_PATCH_FAILED = 'model/ITEM_PATCH_FAILED'
export const FIELD_CHANGED = 'model/FIELD_CHANGED'
export const ITEMS_REQUESTED = 'model/ITEMS_REQUESTED'
export const ITEMS_FETCHING = 'model/ITEMS_FETCHING'
export const ITEMS_FETCHED = 'model/ITEMS_FETCHED'
export const FILTER_TOGGLED = 'model/FILTER_TOGGLED'
export const FILTER_SET = 'model/FILTER_SET'
export const PAGINATE = 'model/PAGINATE'
export const AUTOSAVE_TOGGLE = 'model/AUTOSAVE_TOGGLE'

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

const mergeDirty = R.cond([
  [R.isNil, R.always({})],
  [
    R.propSatisfies(R.complement(R.isEmpty), '_dirty'),
    R.converge(R.mergeLeft, [R.prop('_dirty'), R.dissoc('_dirty')]),
  ],
  [R.T, R.identity],
])

const getItem = (modelName, id, state) =>
  R.view(R.lensPath([modelName, 'items', '' + id]))(state)

const getItems = modelName =>
  R.pipe(
    getSelector(itemsLens)(modelName),
    R.filter(R.prop('id')),
    R.map(mergeDirty),
  )

const getItemStatus = R.cond([
  [R.prop('_syncing'), R.always('syncing')],
  [R.prop('_dirty'), R.always('dirty')],
  [R.prop('_error'), R.always('error')],
  [R.not, R.always('not found')],
  [R.T, R.always('ok')],
])

const getDirty = (modelName, id) =>
  R.view(R.lensPath([modelName, 'items', id, '_dirty']))

// :: modelName -> {k: selector} -- (redux selector factory)
export const modelSelectors = partialMap({
  getAutosave: getSelector(autosaveLens),
  getChoices: modelName =>
    R.pipe(
      getItems(modelName),
      R.values,
      R.map(({ id, name = id }) => ({ value: id, display_name: name })),
    ),
  getDirty: R.curryN(2, getDirty),
  getFetching: getSelector(fetchingLens),
  getItem: R.curryN(
    3,
    R.pipe(
      getItem,
      mergeDirty,
    ),
  ),
  getItems,
  getItemList: getSelector(paginationItemsLens),
  getItemStatus: R.curryN(
    3,
    R.pipe(
      getItem,
      getItemStatus,
    ),
  ),
  getPagination: getSelector(paginationLens),
  getQuery: getSelector(queryLens),
})

// :: ActionType -> ( * -> Payload ) -> ModelName -> ActionCreator (fn)
// -- (create redux action creator)
export const getActionCreator = R.curry((type, payloadTransform, modelName) =>
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
  fieldChanged: getActionCreator(FIELD_CHANGED, (id, field, value) => ({
    id,
    field,
    value,
  })),
  filterSet: getActionCreator(FILTER_SET, (key, value) => ({ key, value })),
  filterToggled: getActionCreator(FILTER_TOGGLED, (key, value) => ({
    key,
    value,
  })),
  itemAdded: getActionCreator(ITEM_ADDED, data => data),
  itemCloned: getActionCreator(ITEM_CLONED, id => ({ id })),
  itemCreateFailed: getActionCreator(ITEM_CREATE_FAILED, error => error),
  itemCreated: getActionCreator(ITEM_CREATED, data => data),
  itemDeleted: getActionCreator(ITEM_DELETED, id => ({ id })),
  itemPatchFailed: getActionCreator(ITEM_PATCH_FAILED, error => error),
  itemPatchStart: getActionCreator(ITEM_PATCH_START, id => ({ id })),
  itemPatchSuccess: getActionCreator(ITEM_PATCH_SUCCESS, data => data),
  itemPost: getActionCreator(ITEM_POST, id => ({ id })),
  itemRequested: getActionCreator(
    ITEMS_REQUESTED,
    (id, params = {}, replace = false) => ({
      params: { id__in: [id], ...params },
      replace,
    }),
  ),
  itemSave: getActionCreator(ITEM_SAVE, (id, patch) => ({ id, patch })),
  itemsDiscarded: getActionCreator(ITEMS_DISCARDED, (...ids) => ({ ids })),
  itemsFetched: getActionCreator(ITEMS_FETCHED, data => data),
  itemsFetching: getActionCreator(ITEMS_FETCHING, data => data),
  itemsRequested: getActionCreator(
    ITEMS_REQUESTED,
    (params, replace = false) => ({ params, replace }),
  ),
  paginate: getActionCreator(PAGINATE, data => data),
})

// :: Url -> Int -- ( Extract pagination offset from DRF url with url attributes )
const offsetFromUrl = R.compose(
  R.defaultTo(0),
  parseInt,
  R.prop(1),
  R.match(/(?:offset=)(\d+)/),
  R.defaultTo(''),
)

const baseItemState = { _dirty: null, _error: null, _syncing: false }

// :: () => State
export const baseInitialState = R.pipe(
  R.always({}),
  R.set(itemsLens, { 0: baseItemState }),
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
    R.mergeLeft(baseItemState),
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
      return R.compose(
        R.over(itemsLens, R.omit(ids)),
        R.over(paginationItemsLens, R.without(ids)),
      )
    }
    case ITEM_PATCH_START:
      return R.over(
        itemLens(payload.id),
        R.pipe(
          R.assoc('_syncing', true),
          mergeDirty,
        ),
      )
    case ITEM_PATCH_SUCCESS:
      // received single item patch from server
      return R.over(
        itemLens(payload.id),
        R.pipe(
          R.mergeDeepLeft(payload),
          R.mergeLeft({ _syncing: false, _error: null }),
        ),
      )
    case ITEM_PATCH_FAILED:
      return R.over(
        itemLens(payload.id),
        R.mergeLeft({ _syncing: false, _error: payload }),
      )
    case ITEM_CREATED:
      // new item created
      return R.compose(
        R.set(itemLens(payload.id), payload),
        R.over(paginationItemsLens, R.union([payload.id])),
      )
    case ITEM_CREATE_FAILED:
      return R.over(itemLens(0), R.assoc('_error', payload))
    case ITEM_ADDED:
      // received single new item
      return R.compose(
        R.set(itemLens(payload.id), payload),
        R.over(itemLens(0), R.mergeLeft(baseItemState)),
        R.over(paginationItemsLens, R.union([payload.id])),
      )
    case FIELD_CHANGED: {
      // single item field changed client side
      const { id, field, value = null } = payload
      return R.over(itemLens(id), R.assocPath(['_dirty', field], value))
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
