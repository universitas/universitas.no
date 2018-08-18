import { HOME, SECTION, STORY } from 'ducks/router'

// Lenses
const lens = R.pipe(R.split('.'), R.lensPath)
const sliceLens = lens('newsFeed')
const selectorFromLens = l => R.view(R.compose(sliceLens, l))

const feedLens = lens('results')
const searchLens = lens('search')
const fetchingLens = lens('fetching')
const languageLens = lens('language')
const searchResultsLens = lens('searchResults')

// Selectors
export const getFeed = R.view(sliceLens)

const getSections = title =>
  ({
    kultur: [3, 8],
    debatt: [4, 7],
    magasin: [2],
    nyhet: [1],
  }[title] || null)

const filterFeed = ({ results = [], language, section }) => {
  const sections = getSections(section)
  const isSection = sections
    ? R.filter(R.propSatisfies(R.flip(R.contains)(sections), 'section'))
    : R.identity

  const isLanguage = language
    ? R.filter(R.propEq('language', language))
    : R.identity

  return R.into([], R.compose(isSection, isLanguage), results)
}

export const getItems = R.pipe(getFeed, filterFeed)
export const getSearch = selectorFromLens(searchLens)
export const getSearchResults = selectorFromLens(searchResultsLens)
export const getFetching = selectorFromLens(fetchingLens)
export const getLanguage = selectorFromLens(languageLens)
export const getFeedQuery = R.pipe(
  getFeed,
  R.pick(['search', 'language', 'section']),
  R.evolve({ section: getSections })
)

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
export const SEARCH_FETCHED = 'newsfeed/SEARCH_FETCHED'
export const searchFetched = data => ({
  type: SEARCH_FETCHED,
  payload: data,
})
export const TOGGLE_LANGUAGE = 'newsfeed/TOGGLE_LANGUAGE'
export const toggleLanguage = language => ({
  type: TOGGLE_LANGUAGE,
  payload: { language },
})
export const SEARCH = 'newsfeed/SEARCH'
export const changeSearch = search => ({
  type: SEARCH,
  payload: { search },
})

// reducers
const initialState = {
  fetching: false,
  results: [],
  searchResults: [],
  section: null,
  search: '',
  language: 'nor',
}

const mergeFeed = fetched => (state = []) =>
  R.pipe(
    state => R.concat(state, fetched),
    R.indexBy(R.prop('id')),
    R.values,
    R.sortBy(R.prop('order')),
    R.reverse
  )(state)

const mergeLeft = R.flip(R.merge)

const getReducer = ({ type, payload, error }) => {
  switch (type) {
    case STORY:
      return R.assoc('search', '')
    case HOME:
      return mergeLeft({
        section: null,
        next: true,
        search: '',
        searchResults: [],
      })
    case SECTION:
      return mergeLeft({ ...payload, next: true })
    case FEED_REQUESTED:
      return R.assoc('fetching', true)
    case FEED_FETCHED: {
      const { results, next } = payload
      return R.compose(
        mergeLeft({ fetching: false, next }),
        R.over(feedLens, mergeFeed(results))
      )
    }
    case SEARCH:
      return mergeLeft({ ...payload, fetching: true, next: true })
    case SEARCH_FETCHED: {
      const { results, next } = payload
      return R.compose(
        mergeLeft({ fetching: false, next }),
        R.set(searchResultsLens, results)
      )
    }
    case TOGGLE_LANGUAGE:
      return R.compose(
        R.over(
          languageLens,
          l => (l == payload.language ? null : payload.language)
        ),
        R.assoc('next', true)
      )
    default:
      return R.identity
  }
}

export default (state = initialState, action) => getReducer(action)(state)
