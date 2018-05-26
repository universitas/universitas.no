import { takeLatest, call, put } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { apiList } from 'services/api'
import { FEED_REQUESTED, feedFetched } from 'ducks/newsFeed'
import { SITE_REQUESTED, siteFetched } from 'ducks/site'

export default function* rootSaga() {
  yield takeLatest(FEED_REQUESTED, requestFeed)
  yield takeLatest(SITE_REQUESTED, requestSite)
}

function* requestFeed(action) {
  const DEBOUNCE = 300 // ms debounce
  const { params } = action.payload
  if (!R.isEmpty(params)) yield call(delay, DEBOUNCE)
  const { response, error } = yield call(apiList, 'frontpage', {})
  if (response) yield put(feedFetched(response))
  else console.error(error)
}

function* requestSite(action) {
  const { response, error } = yield call(apiList, 'site')
  if (response) yield put(siteFetched(response))
  else console.error(error)
}
