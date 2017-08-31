import { takeEvery, select, call, put } from 'redux-saga/effects'
import { apiList } from '../services/api'
import { storyTypesFetched, ITEMS_REQUESTED } from './duck'

export default function* rootSaga() {
  yield takeEvery(ITEMS_REQUESTED, requestStoryTypes)
}

function* requestStoryTypes(action) {
  const data = yield call(fetchStoryTypes)
  if (data) {
    yield put(storyTypesFetched(data))
  }
}

function* fetchStoryTypes() {
  const { response, error } = yield call(apiList, 'storytypes')
  if (response) {
    return response
  } else {
    yield put({ type: 'ERROR', error })
  }
}
