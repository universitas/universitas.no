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
} from '../services/api'
import {
  ITEMS_FETCHED,
  ITEMS_REQUESTED,
  ITEM_REQUESTED,
  ITEM_DELETED,
  ITEM_CREATED,
  ITEM_SELECTED,
  REVERSE_URL,
  FILTER_TOGGLED,
  FILTER_SET,
  FIELD_CHANGED,
  ITEM_CLONED,
  modelSelectors,
  modelActions,
  actionModelLens,
} from 'ducks/basemodel'
import { push } from 'redux-little-router'

const PATCH_DEBOUNCE = 1000
const SEARCH_DEBOUNCE = 300

// router selector
const getRouteParams = R.path(['router', 'params'])
const reverseRoute = ({ model, id, detail }) =>
  R.pipe(R.reject(R.isNil), R.map(v => `${v}`), R.join('/'))([
    '',
    model,
    id,
    detail,
  ])

export default function* rootSaga() {
  yield takeEvery(ITEMS_FETCHED, itemListScrollTopHack)
  yield takeLatest([FILTER_TOGGLED, FILTER_SET], queryChanged)
  yield takeEvery(ITEMS_REQUESTED, requestItems)
  yield takeLatest(REVERSE_URL, routePush)
  yield takeEvery([ITEM_SELECTED, ITEM_REQUESTED], fetchItem)
  yield takeLatest(FIELD_CHANGED, patchSaga)
  yield takeEvery(ITEM_CLONED, cloneSaga)
  yield takeEvery(ITEM_CREATED, createSaga)
  yield takeEvery(ITEM_DELETED, deleteSaga)
  yield fork(watchRouteChange)
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
  ])
}

function* itemListScrollTopHack() {
  // scroll to top when loading new items. This feels hacky.
  try {
    document.querySelector('.itemList').scrollTop = 0
  } catch (e) {}
}

function* watchRouteChange() {
  while (true) {
    const action = yield take('ROUTER_LOCATION_CHANGED')
    const { id, model } = R.pathOr({}, ['payload', 'params'], action)
    if (!model) continue
    const { itemSelected } = modelActions(model)
    yield put(itemSelected(parseInt(id || 0)))
  }
}
function* routePush(action) {
  const currentParams = yield select(getRouteParams)
  const url = reverseRoute({ ...currentParams, ...action.payload })
  yield put(push(url))
}

function* fetchItem(action) {
  const { getItem, itemAdded, itemPatched, apiGet } = modelFuncs(action)
  const { id, force } = action.payload
  if (!id) return // id is 0 or null
  const data = yield select(getItem(id))
  const exists = R.not(R.isEmpty(data))
  if (!force && exists) return // already fetched
  const updateAction = exists ? itemPatched : itemAdded
  const { error, response } = yield call(apiGet, id)
  if (response) yield put(updateAction(response))
  else yield put(errorAction(error))
}

function* queryChanged(action) {
  yield call(delay, SEARCH_DEBOUNCE) // debounce
  yield call(requestItems, action)
}

function* requestItems(action) {
  const { itemsFetched, getQuery, apiList } = modelFuncs(action)
  const params =
    R.path(['payload', 'params'])(action) || (yield select(getQuery))
  const { response, error } = yield call(apiList, params)
  if (response) yield put(itemsFetched(response))
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
  const { getItem, reverseUrl } = modelFuncs(action)
  const { working_title, story_type, bodytext_markup } = yield select(
    getItem(id)
  )
  const data = {
    working_title: 'ny ' + working_title,
    story_type,
    bodytext_markup,
    publication_status: 0,
  }
  const response = yield call(createSaga, { ...action, payload: data })
  if (response) yield put(reverseUrl({ id: response.id, detail: null }))
}
