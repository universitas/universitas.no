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
  storiesFetched,
  storySelected,
  storyPatched,
  ITEMS_REQUESTED,
  ITEM_SELECTED,
  FILTER_TOGGLED,
  FIELD_CHANGED,
  getStory,
  getQuery,
  storyAdded,
} from './duck'

export default function* rootSaga() {
  yield takeLatest(FILTER_TOGGLED, requestStories)
  yield takeLatest(ITEM_SELECTED, selectStory)
  yield takeLatest(FIELD_CHANGED, patchStory)
  yield takeEvery(ITEMS_REQUESTED, requestStories)
  yield fork(watchRouteChange)
}

function* watchRouteChange() {
  while (true) {
    const action = yield take('ROUTER_LOCATION_CHANGED')
    const { id, model } = R.path(['payload', 'params'])(action)
    if (model == 'stories') {
      if (id) {
        yield put(storySelected(parseInt(id)))
      } else {
        yield put(storySelected(0))
        yield fork(requestStories, action)
      }
    }
  }
}

function* selectStory(action) {
  const id = action.payload.id
  let data = yield select(getStory(id))
  if (id && !data) {
    data = yield call(apiGet('stories'), id)
    yield put(storyAdded(data.response))
  }
}
function* requestStories(action) {
  const url = R.path(['payload', 'url'])(action)
  let data = null
  if (url) {
    console.log('request url', url)
    data = yield call(fetchUrl, url)
  } else {
    console.log('request stories')
    data = yield call(fetchStories)
  }
  if (data) {
    yield put(storiesFetched(data))
  }
}
function* patchStory(action) {
  // debounce
  yield call(delay, 500)
  const { id, field, value } = action.payload
  const data = yield call(apiPatch('stories'), id, { [field]: value })
  if (data) {
    yield put(storyPatched(data))
  }
}

function* fetchStories() {
  const attrs = yield select(getQuery)
  const { response, error } = yield call(apiList, 'stories', attrs)
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
