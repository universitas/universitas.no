// Saga for image cropping app (frontpage and /foto/)
//
// TODO: This app should get deprecated by prodsys, since there's much
// redundancy between the apps

import {
  takeLatest,
  takeEvery,
  select,
  call,
  put,
  all,
  cancel,
  fork,
  take,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { searchUrl, apiFetch, apiPatch, apiGet } from 'services/api'
import {
  SEARCH_CHANGED,
  SEARCH_URL_CHANGED,
  searchUrlChanged,
  imagesFetchSuccess,
} from 'x/ducks/imageList'
import { IMAGE_CLICKED, imageSelected } from 'x/ducks/cropWidgetUi'
import {
  getImage,
  addImage,
  imageFilePatched,
  AUTOCROP_IMAGE,
  CROP_IMAGE,
} from 'x/ducks/images'

const takeLatestById = (pattern, saga, ...args) =>
  fork(function*() {
    const tasks = {}
    while (true) {
      const action = yield take(pattern)
      const { id } = action.payload || { id: 0 }
      const lastTask = tasks[id]
      if (lastTask) {
        yield cancel(lastTask) // cancel is no-op if the task has already terminated
      }
      tasks[id] = yield fork(saga, ...args.concat(action))
    }
  })

export default function* rootSaga() {
  yield all([
    takeLatest(SEARCH_CHANGED, searchChanged),
    takeLatest(SEARCH_URL_CHANGED, performSearch),
    takeLatest(IMAGE_CLICKED, selectImage),
    takeLatestById(CROP_IMAGE, updateCropBox),
    takeEvery(AUTOCROP_IMAGE, autoCrop),
  ])
}

const DEBOUNCE_TIMEOUT = 500
const AUTOCROP = 1

function* selectImage(action) {
  const id = action.payload.id
  let imageState = yield select(getImage, id)
  if (!imageState) {
    imageState = yield call(fetchImage, id)
    yield put(addImage(imageState))
  }
  yield put(imageSelected(imageState))
}

function* fetchImage(id) {
  const { response, error } = yield call(apiGet('photos'), id)
  if (response) {
    return response
  } else {
    yield put({ type: 'ERROR', error })
  }
}
function* patchImage(id, data) {
  const { response, error } = yield call(apiPatch('photos'), id, data)
  if (response) {
    yield put(imageFilePatched(response))
  } else {
    yield put({ type: 'ERROR', error })
  }
}

function* performSearch(action) {
  const { response, error } = yield call(apiFetch, action.payload.url)
  if (response) {
    yield put(imagesFetchSuccess(response))
  } else {
    yield put({ type: 'ERROR', error })
  }
}
function* searchChanged(action) {
  const search = action.payload.searchText
  if (search) {
    yield call(delay, DEBOUNCE_TIMEOUT)
    const url = searchUrl('photos')({ search })
    yield put(searchUrlChanged(url))
  }
}
function* updateCropBox(action) {
  const { id, crop_box } = action.payload
  yield call(delay, 2000) // two seconds debounce
  yield call(patchImage, id, { crop_box })
}

function* autoCrop(action) {
  const { id } = action.payload
  yield call(patchImage, id, { cropping_method: AUTOCROP })
  yield call(delay, 2000) // wait two seconds
  const imageState = yield call(fetchImage, id)
  yield put(addImage(imageState))
}
