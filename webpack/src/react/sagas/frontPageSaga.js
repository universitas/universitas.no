import { takeLatest, call, put, select } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { apiList } from 'services/api'
import { FEED_REQUESTED, feedFetched, feedClear } from 'ducks/newsFeed'
import { SITE_REQUESTED, siteFetched } from 'ducks/site'
import { scrollTo } from 'utils/scroll'
import {
  ONLY_SECTION,
  TOGGLE_SECTION,
  TOGGLE_LANGUAGE,
  SEARCH_QUERY,
  getFrontpageQuery,
} from 'ducks/menu'

export default function* rootSaga() {
  yield takeLatest(FEED_REQUESTED, requestFeed)
  yield takeLatest(SITE_REQUESTED, requestSite)
  yield takeLatest(
    [SEARCH_QUERY, ONLY_SECTION, TOGGLE_SECTION, TOGGLE_LANGUAGE],
    changeFeed
  )
}

const scrollTop = () => {
  document.documentElement.scrollTop = 0
}

function* changeFeed(action) {
  const DEBOUNCE = 400 // ms debounce
  const params = yield select(getFrontpageQuery)
  const { search } = params
  console.log(params)

  if (search && action.type == SEARCH_QUERY && search.length < 4) {
    console.log('bail', search)
    return
  }

  yield call(delay, DEBOUNCE)
  const { response, error } = yield call(apiList, 'frontpage', params)
  yield call(scrollTop)
  yield put(feedClear())
  if (response) yield put(feedFetched(response))
  else console.error(error)
}

function* requestFeed(action) {
  const DEBOUNCE = 300 // ms debounce
  const queryParams = yield select(getFrontpageQuery)
  const params = { ...queryParams, ...action.payload }
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
