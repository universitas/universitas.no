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
import { apiFetch, apiPatch, apiPost, apiList, apiGet } from '../services/api'
import {
  ITEMS_FETCHED,
  ITEMS_REQUESTED,
  ITEM_SELECTED,
  FILTER_TOGGLED,
  FILTER_SET,
  FIELD_CHANGED,
  ITEM_CLONED,
  modelSelectors,
  modelActions,
  actionModelLens,
} from 'ducks/basemodel'
import { push } from 'redux-little-router'

export default function* rootSaga() {
  yield takeEvery(ITEMS_FETCHED, itemListScrollTopHack)
  yield takeLatest([FILTER_TOGGLED, FILTER_SET], requestItems)
  yield takeLatest(ITEM_SELECTED, selectItem)
  yield takeLatest(FIELD_CHANGED, patchItem)
  yield takeEvery(ITEMS_REQUESTED, requestItems)
  yield takeEvery(ITEM_CLONED, cloneItem)
  yield fork(watchRouteChange)
}

const errorAction = error => ({
  type: 'api/ERROR',
  error,
})

const modelFuncs = action => {
  const modelName = R.view(actionModelLens, action)
  const apiFuncs = {
    detailView: id => push(`/${modelName}/${id}`),
    listView: () => push(`/${modelName}/`),
    apiGet: apiGet(modelName),
    apiPost: apiPost(modelName),
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
  document.querySelector('.itemList').scrollTop = 0
}

function* watchRouteChange() {
  while (true) {
    const action = yield take('ROUTER_LOCATION_CHANGED')
    const { id, model } = R.path(['payload', 'params'])(action)
    const { itemSelected } = modelActions(model)
    if (id) {
      yield put(itemSelected(parseInt(id)))
    } else {
      yield put(itemSelected(0))
    }
  }
}
function* selectItem(action) {
  const { getItem, itemAdded, apiGet } = modelFuncs(action)
  const id = R.path(['payload', 'id'], action)
  let data = yield select(getItem(id))
  if (id && !data) {
    data = yield call(apiGet, id)
    yield put(itemAdded(data.response))
  }
}
function* requestItems(action) {
  yield call(delay, 200)
  const { itemsFetched } = modelFuncs(action)
  const url = R.path(['payload', 'url'])(action)
  let data = null
  if (url) {
    data = yield call(fetchUrl, url)
  } else {
    data = yield call(fetchItems, action)
  }
  if (data) {
    yield put(itemsFetched(data))
  }
}
function* patchItem(action) {
  // debounce
  yield call(delay, 1000)
  const { itemPatched, apiPatch } = modelFuncs(action)
  const { id, field, value } = action.payload
  const { error, response } = yield call(apiPatch, id, { [field]: value })
  if (response) {
    yield put(itemPatched(response))
  } else {
    yield put(errorAction(error))
  }
}
function* fetchItems(action) {
  const funcs = modelFuncs(action)
  const { getQuery, apiList } = funcs
  const attrs = yield select(getQuery)
  const { response, error } = yield call(apiList, attrs)
  if (response) {
    return response
  } else {
    yield put(errorAction(error))
  }
}
function* cloneItem(action) {
  const { getItem, itemAdded, apiPost, detailView } = modelFuncs(action)
  const { id } = action.payload
  const { working_title, story_type, bodytext_markup } = yield select(
    getItem(id)
  )
  const data = {
    working_title: 'ny ' + working_title,
    story_type,
    bodytext_markup,
    publication_status: 0,
  }
  const { response, error } = yield call(apiPost, data)
  if (response) {
    yield put(itemAdded(response))
    yield put(detailView(response.id))
  } else {
    yield put({ type: 'ERROR', error })
  }
}
function* fetchUrl(url) {
  const { response, error } = yield call(apiFetch, url)
  if (response) {
    return response
  } else {
    yield put({ type: 'ERROR', error })
  }
}
