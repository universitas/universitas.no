import { put, takeEvery, select, call } from 'redux-saga/effects'
import { pushImageFile, apiPost, apiList } from 'services/api'
import { ASSIGN_PHOTO } from 'ducks/storyImage'
import {
  ADD,
  POST,
  PUSH,
  uploadUpdate,
  uploadPostSuccess,
  uploadPostError,
  getUpload,
} from 'ducks/fileupload'

import { getUser } from 'ducks/auth'

import {
  slugifyFilename,
  jsonToFormData,
  objectURLtoFile,
} from 'utils/fileUtils'

import { modelActions } from 'ducks/basemodel'

const {
  itemsAppended,
  itemsDiscarded,
  itemAdded,
  itemRequested,
} = modelActions('photos')

export default function* uploadSaga() {
  yield takeEvery(ADD, newFileSaga)
  yield takeEvery(POST, postFileSaga)
  yield takeEvery(PUSH, pushImageSaga)
  yield takeEvery(ASSIGN_PHOTO, storyPhotoSaga)
}

const fetchDupes = ({ md5, fingerprint }) =>
  apiList('photos', { md5, fingerprint })

const errorAction = error => ({
  type: 'api/ERROR',
  error,
})

function* storyPhotoSaga(action) {
  console.log(JSON.stringify(action))
}

function* pushImageSaga(action) {
  const { pk } = action.payload
  const { response, error } = yield call(pushImageFile, pk)
  if (response) console.log(response)
  else yield put(errorAction(error))
}

function* newFileSaga(action) {
  const { md5, fingerprint } = action.payload
  const { artist } = yield select(getUpload(md5))
  const { contributor_name } = yield select(getUser)
  if (contributor_name && !artist) {
    yield put(uploadUpdate(md5, { artist: contributor_name, check: false }))
  }
  const { response, error } = yield call(fetchDupes, { md5, fingerprint })
  if (response) {
    const duplicates = R.pipe(
      R.prop('results'),
      R.map(R.pick(['id'])),
      R.map(R.assoc('choice', null))
    )(response)
    yield put(uploadUpdate(md5, { duplicates, check: true }))
    yield put(itemsAppended(response))
  } else {
    yield put(errorAction(error))
  }
}

function* postFileSaga(action) {
  const { pk } = action.payload
  const upload = yield select(getUpload(pk))
  const { objectURL, description, artist, category, story } = upload

  const duplicates = R.pipe(
    R.filter(R.propEq('choice', 'replace')),
    R.pluck('id')
  )(upload.duplicates)
  const filename = slugifyFilename(upload)
  const original = yield call(objectURLtoFile, objectURL, filename)
  const data = {
    description,
    artist,
    category,
    duplicates,
  }
  const formBody = yield call(jsonToFormData, { original, ...data })
  const { response, error } = yield call(apiPost, 'upload', formBody)
  if (response) {
    yield put(uploadPostSuccess(pk, { filename, ...response }))
    if (parseInt(story)) {
      const data = {
        imagefile: response.id,
        parent_story: parseInt(story),
        caption: description,
      }
      const { error } = yield call(apiPost, 'storyimages', data)
      if (error) yield put(errorAction(error))
    }
    yield put(itemsDiscarded(duplicates))
    yield put(itemRequested(response.id))
  } else yield put(uploadPostError(pk))
}
