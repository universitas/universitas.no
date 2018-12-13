// extra model saga for story
//
import { put, takeEvery, select, call } from 'redux-saga/effects'
// import { delay } from 'redux-saga'
import { pushImageFile, apiList, apiPost, apiDelete } from 'services/api'
import {
  ASSIGN_PHOTO,
  PUSH_PHOTO,
  deleteStoryImage,
  DELETE_STORY_IMAGE,
} from 'ducks/storyimage'

import { PRODSYS } from 'prodsys/ducks/router'
import { modelSelectors, modelActions, ITEMS_FETCHED } from 'ducks/basemodel'

const errorAction = error => ({ type: 'api/ERROR', error })

const { getItem: getStoryImage } = modelSelectors('storyimages')
const {
  itemsFetched: storyImagesFetched,
  itemsDiscarded: storyImagesDiscarded,
} = modelActions('storyimages')

const { getItem: getPhoto } = modelSelectors('photos')
const { itemsRequested: photosRequested } = modelActions('photos')

const { getItem: getStory } = modelSelectors('stories')
const {
  itemPatched: storyPatched,
  itemAdded: storyAdded,
  itemRequested: storyRequested,
} = modelActions('stories')

export default function* storyImageSaga() {
  yield takeEvery(ASSIGN_PHOTO, assignPhotoSaga)
  yield takeEvery(DELETE_STORY_IMAGE, deleteStoryImageSaga)
  yield takeEvery(PUSH_PHOTO, pushPhotoSaga)
  yield takeEvery(PRODSYS, storyRouteSaga)
  yield takeEvery(ITEMS_FETCHED, nestedStoryFetched)
}

function* storyRouteSaga(action) {
  const { model, pk } = action.payload
  if (model != 'stories') return
  if (!pk) return
  const story = yield select(getStory(pk))
  if (!story.images) yield put(storyRequested(pk, { nested: true }, true))
}

function* nestedStoryFetched(action) {
  if (action.meta.modelName != 'stories') return
  const stories = action.payload.results
  const images = R.pipe(
    R.path(['payload', 'results']),
    R.pluck('images'),
    R.filter(R.is(Array)),
    R.unnest,
  )(action)
  const photoIds = R.pluck('imagefile', images)
  yield put(storyImagesFetched({ results: images }))
  yield put(photosRequested({ id__in: photoIds }))
}

function* assignPhotoSaga(action) {
  let { id, story } = action.payload
  const storyData = yield select(getStory(story))
  const exists = R.find(R.propEq('imagefile', id), storyData.images)
  if (exists) {
    yield put(deleteStoryImage(exists.id))
    return
  }
  const { description, ...props } = yield select(getPhoto(id))
  const data = {
    imagefile: id,
    parent_story: story,
    caption: description,
    creditline: getCreditLine(props),
  }
  const { error, response } = yield call(apiPost, 'storyimages', data)
  if (response) yield put(storyRequested(story, { nested: true }, true))
  else yield put(errorAction(error))
}

function* deleteStoryImageSaga(action) {
  const { id } = action.payload
  const { parent_story } = yield select(getStoryImage(id))
  const { response, error } = yield call(apiDelete, 'storyimages', id)
  if (response) {
    yield put(storyImagesDiscarded([id]))
    yield put(storyRequested(parent_story, { nested: true }, true))
  } else yield put(errorAction(error))
}

function* pushPhotoSaga(action) {
  const { id } = action.payload
  const { response, error } = yield call(pushImageFile, id)
  if (error) put(errorAction(error))
}

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
