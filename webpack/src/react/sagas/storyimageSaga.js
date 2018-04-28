import { put, takeEvery, select, call } from 'redux-saga/effects'
// import { delay } from 'redux-saga'
import { pushImageFile, apiPost, apiDelete } from 'services/api'
import { ASSIGN_PHOTO, PUSH_PHOTO, DELETE_STORY_IMAGE } from 'ducks/storyimage'
import { modelSelectors, modelActions } from 'ducks/basemodel'

const { getItem: getStoryImage } = modelSelectors('storyimages')
const { getItem: getPhoto } = modelSelectors('photos')
const { getCurrentItemId: getCurrentStoryId } = modelSelectors('stories')
const { itemRequested: storyRequested } = modelActions('stories')
const { itemsDiscarded: storyImagesDiscarded } = modelActions('storyimages')

export default function* storyImageSaga() {
  yield takeEvery(PUSH_PHOTO, pushPhotoSaga)
  yield takeEvery(ASSIGN_PHOTO, assignPhotoSaga)
  yield takeEvery(DELETE_STORY_IMAGE, deleteStoryImageSaga)
}

const errorAction = error => ({
  type: 'api/ERROR',
  error,
})

const getCreditLine = ({ category, artist }) => {
  switch (category) {
    case 2:
      return `illustrasjon: ${artist}`
    case 3:
      return `grafikk: ${artist}`
    case 5:
      return artist
    default:
      return ''
  }
}

function* assignPhotoSaga(action) {
  let { id, story } = action.payload
  const parent_story = story || (yield select(getCurrentStoryId))
  const { description, ...props } = yield select(getPhoto(id))
  const data = {
    imagefile: id,
    parent_story: parent_story,
    caption: description,
    creditline: getCreditLine(props),
  }
  const { error, response } = yield call(apiPost, 'storyimages', data)
  if (response) yield put(storyRequested(parent_story, true))
  else yield put(errorAction(error))
}

function* deleteStoryImageSaga(action) {
  const { id } = action.payload
  const { parent_story } = yield select(getStoryImage(id))
  const { response, error } = yield call(apiDelete, 'storyimages', id)
  if (response) {
    yield put(storyImagesDiscarded([id]))
    yield put(storyRequested(parent_story, true))
  } else yield put(errorAction(error))
}

function* pushPhotoSaga(action) {
  const { id } = action.payload
  const { response, error } = yield call(pushImageFile, id)
  if (response) console.log(response)
  else yield put(errorAction(error))
}
