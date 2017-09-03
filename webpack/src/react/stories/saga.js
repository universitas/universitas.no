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
import { apiFetch, apiPatch, apiPost, apiList, apiGet } from '../services/api'
import {
  storiesFetched,
  storySelected,
  storyPatched,
  ITEMS_REQUESTED,
  ITEM_SELECTED,
  FILTER_TOGGLED,
  FIELD_CHANGED,
  ITEM_CLONED,
  getStory,
  getQuery,
  storyAdded,
} from './duck'
import { push } from 'redux-little-router'

export default function* rootSaga() {
  yield takeLatest(FILTER_TOGGLED, requestStories)
  yield takeLatest(ITEM_SELECTED, selectStory)
  yield takeLatest(FIELD_CHANGED, patchStory)
  yield takeLatest(ITEMS_REQUESTED, requestStories)
  yield takeEvery(ITEM_CLONED, cloneStory)
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
  yield call(delay, 200)
  const url = R.path(['payload', 'url'])(action)
  let data = null
  if (url) {
    data = yield call(fetchUrl, url)
  } else {
    data = yield call(fetchStories)
  }
  if (data) {
    yield put(storiesFetched(data))
  }
}
function* patchStory(action) {
  // debounce
  yield call(delay, 1000)
  const { id, field, value } = action.payload
  const data = yield call(apiPatch('stories'), id, { [field]: value })
  if (data) {
    yield put(storyPatched(data))
  }
}
function* cloneStory(action) {
  console.log('cloning')
  const { id } = action.payload
  const { working_title, story_type, bodytext_markup } = yield select(
    getStory(id)
  )
  const data = {
    working_title: 'ny ' + working_title,
    story_type,
    bodytext_markup,
    publication_status: 0,
  }
  const { response, error } = yield call(apiPost('stories'), data)
  if (response) {
    yield put(storyAdded(response))
    yield put(push(`/stories/${response.id}`))
  } else {
    yield put({ type: 'ERROR', error })
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
