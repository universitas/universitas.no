import {
  takeLatest,
  takeEvery,
  select,
  call,
  put,
  all,
  fork,
  take,
} from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { apiPatch, apiList, apiGet } from '../services/api'
import {
  contributorsFetched,
  contributorSelected,
  contributorPatched,
  ITEMS_REQUESTED,
  ITEM_SELECTED,
  FILTER_TOGGLED,
  FIELD_CHANGED,
  getContributor,
  getQuery,
  contributorAdded,
} from './duck'

export default function* rootSaga() {
  yield takeLatest(FILTER_TOGGLED, requestContributors)
  yield takeLatest(ITEM_SELECTED, selectContributor)
  yield takeLatest(FIELD_CHANGED, patchContributor)
  yield takeEvery(ITEMS_REQUESTED, requestContributors)
  yield fork(watchRouteChange)
}

function* watchRouteChange() {
  while (true) {
    const action = yield take('ROUTER_LOCATION_CHANGED')
    const { id, model } = R.path(['payload', 'params'])(action)
    if (model == 'contributors') {
      if (id) {
        yield put(contributorSelected(parseInt(id)))
      } else {
        yield put(contributorSelected(0))
        yield fork(requestContributors, action)
      }
    }
  }
}

function* selectContributor(action) {
  const id = action.payload.id
  let data = yield select(getContributor(id))
  if (id && !data) {
    data = yield call(apiGet('contributors'), id)
    yield put(contributorAdded(data.response))
  }
}
function* requestContributors(action) {
  console.log('request Contributors')
  const data = yield call(fetchContributors)
  if (data) {
    yield put(contributorsFetched(data))
  }
}
function* patchContributor(action) {
  // debounce
  yield call(delay, 500)
  const { id, field, value } = action.payload
  const data = yield call(apiPatch('contributors'), id, { [field]: value })
  if (data) {
    yield put(contributorPatched(data))
  }
}

function* fetchContributors() {
  const attrs = yield select(getQuery)
  const { response, error } = yield call(apiList, 'contributors', attrs)
  if (response) {
    return response
  } else {
    yield put({ type: 'ERROR', error })
  }
}
