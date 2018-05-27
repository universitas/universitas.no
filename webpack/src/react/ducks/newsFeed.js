// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const sliceLens = lens('newsFeed')
const feedLens = lens('results')

// Selectors
const selectorFromLens = l => R.view(R.compose(sliceLens, l))
export const getFeed = R.view(sliceLens)

// Actions
export const FEED_REQUESTED = 'newsfeed/FEED_REQUESTED'
export const feedRequested = (params = {}) => ({
  type: FEED_REQUESTED,
  payload: params,
})

export const FEED_FETCHED = 'newsfeed/FEED_FETCHED'
export const feedFetched = data => ({
  type: FEED_FETCHED,
  payload: data,
})

// reducers
const initialState = { fetching: false }

const mergeFeed = fetched => (state = []) =>
  R.pipe(
    state => R.concat(state, fetched),
    R.indexBy(R.prop('id')),
    R.values,
    R.sortBy(R.prop('order')),
    R.reverse
  )(state)

// R.compose(
//   // state => R.concat(fetched, state),
//   R.indexBy(R.prop('id')),
//   R.values,
//   R.sortBy(R.prop('order'))
// )()

const getReducer = ({ type, payload, error }) => {
  switch (type) {
    case FEED_REQUESTED:
      return R.assoc('fetching', true)
    case FEED_FETCHED: {
      const { results, next } = payload
      return R.compose(
        R.assoc('fetching', false),
        R.assoc('next', next),
        R.over(feedLens, mergeFeed(results))
      )
    }
    default:
      return R.identity
  }
}

export default (state = initialState, action) => getReducer(action)(state)
