import { put, takeEvery, select, call } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { pushImageFile, apiGet, apiPost, apiList } from 'services/api'
import { apiUrlToId } from 'utils/urls'
import { assignPhoto } from 'ducks/storyimage'
import {
  ADD,
  POST,
  CHANGE_DUPLICATE,
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

import { modelSelectors, modelActions } from 'ducks/basemodel'

const { getItem: getPhoto } = modelSelectors('photos')
const {
  itemsDiscarded: photosDiscarded,
  itemRequested: photoRequested,
  itemsFetched: photosAppended,
  itemAdded: photoAdded,
} = modelActions('photos')
const { itemAdded: contributorAdded } = modelActions('contributors')

const { itemRequested: storyRequested } = modelActions('stories')

export default function* uploadSaga() {
  yield takeEvery(ADD, newUploadSaga)
  yield takeEvery(POST, postUploadSaga)
  yield takeEvery(CHANGE_DUPLICATE, toggleDuplicateSaga)
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

function* toggleDuplicateSaga(action) {
  const { pk, id, choice } = action.payload
  if (choice == 'keep') return
  const photo = yield select(getPhoto(id))
  const upload = yield select(getUpload(pk))
  const update = {
    description: upload.description || photo.description,
    contributor: photo.contributor || upload.contributor,
    category: photo.category || upload.category,
  }
  yield put(uploadUpdate(pk, update, true))
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
  const { response, error } = yield call(fetchDupes, { fingerprint })
  if (response) {
    const duplicates = R.pipe(
      R.prop('results'),
      R.map(R.pick(['id'])),
      R.map(R.assoc('choice', 'keep')),
    )(response)
    yield put(uploadUpdate(md5, { duplicates, check: true }))
    yield put(photosFetched(response))
  } else {
    yield put(errorAction(error))
  }
}

function* postUploadSaga(action) {
  const { pk } = action.payload
  const upload = yield select(getUpload(pk))
  const {
    objectURL,
    description,
    contributor,
    category,
    story,
    width,
    height,
  } = upload
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
    const photo = {
      id,
      description,
      contributor,
      category,
      small: objectURL,
      large: objectURL,
      width,
      height,
    }
    yield put(uploadPostSuccess(pk, response))
    yield put(photosDiscarded(...duplicates))
    yield put(photoAdded(photo))
    const ready = yield pollPhoto(id)
    if (!ready) {
      yield put(
        uploadPostError(pk, { message: 'Image was not processed on server' }),
      )
    } else if (story) {
      yield put(assignPhoto(id, parseInt(story)))
    }
  } else {
    yield put(uploadPostError(pk, error))
  }
}

function* pollPhoto(pk, sleep = 2000, tries = 6) {
  // polls api for photo until it's ok
  for (let n = 0; n < tries; n++) {
    const wait = 2 ** n * sleep
    yield call(delay, wait) // wait for image to process
    const { response } = yield call(apiGet, 'photos', pk)
    if (response.original) {
      yield put(photoAdded(response))
      return true
    }
  }
  return false
}
