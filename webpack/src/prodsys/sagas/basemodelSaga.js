import {
  takeLatest,
  takeEvery,
  select,
  call,
  put,
  all,
  fork,
  take,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { scrollTo } from 'utils/scroll'
import {
  apiFetch,
  apiPatch,
  apiPost,
  apiDelete,
  apiList,
  apiGet,
} from 'services/api'
import { PRODSYS } from 'prodsys/ducks/router'

import {
  ITEMS_FETCHED,
  ITEMS_REQUESTED,
  ITEM_REQUESTED,
  ITEM_DELETED,
  ITEM_CREATED,
  ITEM_SELECTED,
  FILTER_TOGGLED,
  FILTER_SET,
  FIELD_CHANGED,
  ITEM_CLONED,
  modelSelectors,
  modelActions,
  actionModelLens,
} from 'ducks/basemodel'
import { toRoute } from 'prodsys/ducks/router'

const PATCH_DEBOUNCE = 1000
const SEARCH_DEBOUNCE = 300

// router selector
const getRouteParams = R.path(['router', 'params'])

export default function* rootSaga() {
  yield takeLatest([FILTER_TOGGLED, FILTER_SET], queryChanged)
  yield takeEvery(ITEMS_REQUESTED, requestItems)
  yield takeEvery([ITEM_SELECTED, ITEM_REQUESTED], fetchItems)
  yield takeLatest(FIELD_CHANGED, patchSaga)
  yield takeEvery(ITEM_CLONED, cloneSaga)
  yield takeEvery(ITEM_CREATED, createSaga)
  yield takeEvery(ITEM_DELETED, deleteSaga)
  yield takeEvery(PRODSYS, routeSaga)
}

const errorAction = error => ({
  type: 'api/ERROR',
  error,
})

export const modelFuncs = action => {
  const modelName = R.view(actionModelLens, action)
  const apiFuncs = {
    // detailView: id => push(`/${modelName}/${id}`),
    // listView: () => push(`/${modelName}/`),
    apiGet: apiGet(modelName),
    apiPost: apiPost(modelName),
    apiDelete: apiDelete(modelName),
    apiList: apiList(modelName),
    apiPatch: apiPatch(modelName),
  }
  return R.mergeAll([
    apiFuncs,
    modelSelectors(modelName),
    modelActions(modelName),
    { toRoute: props => toRoute({ model: modelName, ...props }) },
  ])
}

function* routeSaga(action) {
  const { model, pk } = action.payload
  const { getItemList } = modelSelectors(model)
  const { itemRequested, itemsRequested } = modelActions(model)
  const items = yield select(getItemList)
  if (R.isEmpty(items)) yield put(itemsRequested())
  if (pk) yield put(itemRequested(pk))
}

function* fetchItems(action) {
  const { getItem, itemAdded, itemPatched, apiGet } = modelFuncs(action)
  const { ids = [], force = false } = action.payload
  for (const id of ids) {
    if (id == 0) continue
    const data = yield select(getItem(id))
    const exists = R.not(R.isEmpty(data))
    if (!force && exists) continue // already fetched
    const updateAction = exists ? itemPatched : itemAdded
    const { error, response } = yield call(apiGet, id)
    if (response) yield put(updateAction(response))
    else yield put(errorAction(error))
  }
}

function* queryChanged(action) {
  yield call(delay, SEARCH_DEBOUNCE) // debounce
  yield call(requestItems, action)
}

function* requestItems(action) {
  const {
    itemsFetching,
    itemsFetched,
    itemsAppended,
    getQuery,
    apiList,
  } = modelFuncs(action)
  const append = R.path(['payload', 'append'], action)
  const params =
    R.path(['payload', 'params'])(action) || (yield select(getQuery))
  yield put(itemsFetching())
  const { response, error } = yield call(apiList, params)
  if (response)
    yield put(append ? itemsAppended(response) : itemsFetched(response))
  else yield put(errorAction(error))
}

function* patchSaga(action) {
  // debounce
  yield call(delay, PATCH_DEBOUNCE)
  const { itemPatched, apiPatch } = modelFuncs(action)
  const { id, field, value } = action.payload
  const { error, response } = yield call(apiPatch, id, { [field]: value })
  if (response) yield put(itemPatched(response))
  else yield put(errorAction(error))
}

function* deleteSaga(action) {
  const { id } = action.payload
  const { apiDelete, itemsDiscarded } = modelFuncs(action)
  const { response, error } = yield call(apiDelete, id)
  if (response) {
    yield put(itemsDiscarded(id))
  } else yield put(errorAction(error))
}

function* createSaga(action) {
  const data = action.payload
  const { apiPost, itemAdded } = modelFuncs(action)
  const { response, error } = yield call(apiPost, data)
  if (response) {
    yield put(itemAdded(response))
    return response
  } else yield put(errorAction(error))
}

function* cloneSaga(action) {
  // post a new story
  const { id } = action.payload
  const { getItem, toRoute } = modelFuncs(action)
  const { working_title, story_type, bodytext_markup } = yield select(
    getItem(id),
  )
  const data = {
    working_title: 'ny ' + working_title,
    story_type,
    bodytext_markup,
    publication_status: 0,
  }
  const response = yield call(createSaga, { ...action, payload: data })
  if (response) yield put(toRoute({ pk: response.id, action: 'change' }))
}
