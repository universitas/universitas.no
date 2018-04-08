import { put, takeEvery, select, call } from 'redux-saga/effects'
import { apiPost, apiList } from 'services/api'
import {
  ADD,
  POST,
  uploadUpdate,
  uploadPostSuccess,
  uploadPostError,
  getUpload,
} from 'ducks/fileupload'

import { getUser } from 'ducks/auth'

import { jsonToFormData, objectURLtoFile } from 'utils/fileupload'

import { modelActions } from 'ducks/basemodel'

const { itemsAppended, itemAdded } = modelActions('images')

export default function* uploadSaga() {
  yield takeEvery(ADD, newFileSaga)
  yield takeEvery(POST, postFileSaga)
}

const fetchDupes = ({ md5, fingerprint }) =>
  apiList('images', { md5, fingerprint })

const errorAction = error => ({
  type: 'api/ERROR',
  error,
})

function* newFileSaga(action) {
  const { md5, fingerprint } = action.payload
  const { artist } = yield select(getUpload(md5))
  const { contributor_name } = yield select(getUser)
  if (contributor_name && !artist) {
    yield put(uploadUpdate(md5, { artist: contributor_name }))
  }
  const { response, error } = yield call(fetchDupes, { md5, fingerprint })
  if (response) {
    const duplicates = R.pipe(
      R.prop('results'),
      R.map(R.pick(['id'])),
      R.map(R.assoc('choice', null))
    )(response)
    yield put(uploadUpdate(md5, { duplicates }))
    yield put(itemsAppended(response))
  } else {
    yield put(errorAction(error))
  }
}
function* postFileSaga(action) {
  const pk = action.payload.pk
  console.log('posting', pk)
  const {
    objectURL,
    filename,
    description,
    artist,
    category,
    duplicates,
  } = yield select(getUpload(action.payload.pk))
  const original = yield call(objectURLtoFile, objectURL, filename)
  const formBody = yield call(jsonToFormData, {
    original,
    description,
    artist,
    category,
    duplicates: R.pluck('id', duplicates),
  })
  const { response, error } = yield call(apiPost, 'upload', formBody)
  if (response) {
    yield put(uploadPostSuccess(pk, response))
    yield put(itemAdded(response))
  } else yield put(uploadPostError(pk))
}
