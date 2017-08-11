import R from 'ramda'
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
import { apiFetch, apiPatch, apiList, apiGet } from '../services/api'
import {
  photosFetched,
  photoSelected,
  photoPatched,
  ITEMS_REQUESTED,
  ITEM_SELECTED,
  FILTER_TOGGLED,
  FIELD_CHANGED,
  getPhoto,
  getQuery,
  photoAdded,
} from './duck'

export default function* rootSaga() {
  yield takeLatest(FILTER_TOGGLED, requestPhotos)
  yield takeLatest(ITEM_SELECTED, selectPhoto)
  yield takeLatest(FIELD_CHANGED, patchPhoto)
  yield takeEvery(ITEMS_REQUESTED, requestPhotos)
  yield fork(watchRouteChange)
}

const getModel = action => {
  return R.path(['payload', 'result', 'model'])(action)
}

function* watchRouteChange() {
  while (true) {
    const action = yield take('ROUTER_LOCATION_CHANGED')
    if (getModel(action) == 'photo') yield fork(requestPhotos, action)
    const id = R.path(['payload', 'params', 'id'])(action)
    if (id) {
      yield put(photoSelected(parseInt(id)))
    } else {
      yield put(photoSelected(0))
    }
  }
}

function* selectPhoto(action) {
  const id = action.payload.id
  let data = yield select(getPhoto(id))
  if (id && !data) {
    data = yield call(apiGet('images'), id)
    yield put(photoAdded(data.response))
  }
}
function* requestPhotos(action) {
  const url = R.path(['payload', 'url'])(action)
  let data = null
  if (url) {
    console.log('request url', url)
    data = yield call(fetchUrl, url)
  } else {
    console.log('request Photos')
    data = yield call(fetchPhotos)
  }
  if (data) {
    yield put(photosFetched(data))
  }
}
function* patchPhoto(action) {
  // debounce
  yield call(delay, 500)
  const { id, field, value } = action.payload
  const data = yield call(apiPatch('images'), id, { [field]: value })
  if (data) {
    yield put(photoPatched(data))
  }
}

function* fetchPhotos() {
  const attrs = yield select(getQuery)
  const { response, error } = yield call(apiList, 'images', attrs)
  if (response) {
    return response
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
