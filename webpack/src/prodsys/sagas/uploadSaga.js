import { put, takeEvery, select, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { pushImageFile, apiPost, apiList } from 'services/api'
import { apiUrlToId } from 'utils/urls'
import { assignPhoto } from 'ducks/storyimage'
import {
  ADD,
  POST,
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
  itemsDiscarded: photosDiscarded,
  itemRequested: photoRequested,
  itemsAppended: photosAppended,
} = modelActions('photos')
const { itemAdded: contributorAdded } = modelActions('contributors')

const { itemRequested: storyRequested } = modelActions('stories')

export default function* uploadSaga() {
  yield takeEvery(ADD, newUploadSaga)
  yield takeEvery(POST, postUploadSaga)
}

const fetchDupes = ({ md5, fingerprint }) =>
  apiList('photos', { md5, fingerprint })

const errorAction = error => ({
  type: 'api/ERROR',
  error,
})

function* getArtist(name) {
  const params = { search: name }
  const { response, error } = yield call(apiList('contributors'), params)
  if (response) {
    const artist = R.path(['results', 0], response)
    if (!artist) return null
    yield put(contributorAdded(artist))
    return artist.id
  } else yield put(errorAction(error))
}

function* newUploadSaga(action) {
  const { md5, fingerprint, artist } = action.payload
  let contributor = undefined
  if (artist) {
    try {
      contributor = yield call(getArtist, artist)
    } catch (e) {
      console.error(e)
    }
  }
  const user = yield select(getUser)
  if (!contributor) contributor = user.contributor
  if (contributor) {
    yield put(
      uploadUpdate(md5, { contributor: apiUrlToId(contributor), check: false }),
    )
  }
  const { response, error } = yield call(fetchDupes, { md5, fingerprint })
  if (response) {
    const duplicates = R.pipe(
      R.prop('results'),
      R.map(R.pick(['id'])),
      R.map(R.assoc('choice', 'keep')),
    )(response)
    yield put(uploadUpdate(md5, { duplicates, check: true }))
    yield put(photosAppended(response))
  } else {
    yield put(errorAction(error))
  }
}

function* postUploadSaga(action) {
  const { pk } = action.payload
  const upload = yield select(getUpload(pk))
  const { objectURL, description, contributor, category, story } = upload
  const duplicates = R.pipe(
    R.filter(R.propEq('choice', 'replace')),
    R.pluck('id'),
  )(upload.duplicates)
  const filename = slugifyFilename(upload)
  const original = yield call(objectURLtoFile, objectURL, filename)
  const data = {
    description,
    contributor,
    category,
    duplicates,
  }
  const formBody = yield call(jsonToFormData, { original, ...data })
  const { response, error } = yield call(apiPost, 'upload', formBody)
  if (response) {
    const { id } = response
    yield put(uploadPostSuccess(pk, response))
    yield put(photosDiscarded(...duplicates))
    yield put(photoRequested(id))
    if (story) {
      yield call(delay, 5000) // wait 5s for image data to return from server.
      yield put(assignPhoto(id, parseInt(story)))
    }
  } else {
    yield put(uploadPostError(pk, error))
  }
}
