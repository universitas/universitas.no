import {
  takeLatest,
  takeEvery,
  select,
  call,
  put,
  all,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { searchUrl, apiFetch, apiPatch, apiGet } from '../services/api'
import {
  SEARCH_CHANGED,
  SEARCH_URL_CHANGED,
  searchUrlChanged,
  imagesFetchSuccess,
} from '../ducks/imageList'
import { IMAGE_CLICKED, imageSelected } from '../ducks/ui'
import {
  getImage,
  addImage,
  imageFilePatched,
  AUTOCROP_IMAGE,
} from '../ducks/images'
import { END_DRAG_HANDLE, getCropWidget } from '../ducks/cropWidget'

export default function* rootSaga() {
  yield all([
    takeLatest(SEARCH_CHANGED, searchChanged),
    takeLatest(SEARCH_URL_CHANGED, performSearch),
    takeLatest(IMAGE_CLICKED, selectImage),
    takeEvery(AUTOCROP_IMAGE, autoCrop),
    takeLatest(END_DRAG_HANDLE, updateCropBox),
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
  const { response, error } = yield call(apiGet('images'), id)
  if (response) {
    return response
  } else {
    yield put({ type: 'ERROR', error })
  }
}
function* patchImage(id, data) {
  const { response, error } = yield call(apiPatch('images'), id, data)
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
    const url = searchUrl('images')({ search })
    yield put(searchUrlChanged(url))
  }
}
function* updateCropBox(action) {
  const { crop_box } = yield select(getCropWidget)
  yield call(patchImage, action.payload.id, { crop_box })
}
function* autoCrop(action) {
  const cropping_method = AUTOCROP
  yield call(patchImage, action.payload.id, { cropping_method })
}
