// Lenses
const sliceLens = R.lensProp('site')
const uxLens = R.lensProp('ux')

// Selectors
export const getSite = R.view(sliceLens)
export const getSections = R.view(R.compose(sliceLens, R.lensProp('sections')))
export const getUx = R.view(R.compose(sliceLens, uxLens))

// Actions
export const SITE_REQUESTED = 'site/SITE_REQUESTED'
export const siteRequested = () => ({ type: SITE_REQUESTED, payload: {} })

export const SITE_FETCHED = 'site/SITE_FETCHED'
export const siteFetched = data => ({ type: SITE_FETCHED, payload: data })

export const TOGGLE_UX = 'site/TOGGLE_UX'
export const toggleUx = ux => ({
  type: TOGGLE_UX,
  payload: ux,
})

// reducers
const initialState = {
  fetching: false,
  ux: { editing: false, menuExpanded: false },
}

const getReducer = ({ type, payload, error }) => {
  // close menu if route changed
  if (R.test(/^router\//, type))
    return R.over(uxLens, R.assoc('menuExpanded', false))
  switch (type) {
    case SITE_REQUESTED:
      return R.assoc('fetching', true)
    case SITE_FETCHED:
      return R.compose(R.assoc('fetching', false), R.merge(payload))
    case TOGGLE_UX:
      return R.over(uxLens, R.merge(R.__, payload))
    default:
      return R.identity
  }
}

export default (state = initialState, action) => getReducer(action)(state)
