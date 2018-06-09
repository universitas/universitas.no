import { takeLatest, call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { apiList } from 'services/api'
import {
  FEED_REQUESTED,
  TOGGLE_LANGUAGE,
  SEARCH,
  feedFetched,
  searchFetched,
  getFeedQuery,
} from 'ducks/newsFeed'
import { SITE_REQUESTED, siteFetched } from 'ducks/site'
import { scrollTo } from 'utils/scroll'

const DEBOUNCE = 300 // ms debounce

export default function* rootSaga() {
  yield takeLatest(FEED_REQUESTED, requestFeed)
  yield takeLatest(SITE_REQUESTED, requestSite)
  yield takeLatest(SEARCH, requestSearch)
}

const scrollTop = () => {
  document.documentElement.scrollTop = 0
}

function* requestSearch(action) {
  const params = yield select(getFeedQuery)
  const { search } = params
  if (!search) yield put(searchFetched({ results: [], next: false }))
  else {
    yield call(delay, search.length > 3 ? DEBOUNCE : DEBOUNCE * 3)
    const { response, error } = yield call(apiList, 'frontpage', params)
    if (response) yield put(searchFetched(response))
    else console.error(error)
  }
}

function* requestFeed(action) {
  let params = yield select(getFeedQuery)
  params = R.merge(params, action.payload)

  if (!R.isEmpty(params)) yield call(delay, DEBOUNCE)
  const { response, error } = yield call(apiList, 'frontpage', params)
  if (response) yield put(feedFetched(response))
  else console.error(error)
}

function* requestSite(action) {
  const { response, error } = yield call(apiList, 'site', {})
  if (response) yield put(siteFetched(response))
  else console.log(error)
}
