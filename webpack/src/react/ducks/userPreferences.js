//import { LOG_OUT } from 'ducks/auth'

// helpers
const lens = R.pipe(R.split('.'), R.lensPath)

// Lenses
const SLICE = 'preferences'
const sliceLens = lens(SLICE)
const flagLens = R.pipe(R.lensProp, R.lensProp('featureFlags'), sliceLens)

// Selectors
export const getPreferences = R.view(sliceLens)
// :: string -> State -> bool
export const getFeatureFlag = R.pipe(flagLens, R.view)

// Action creators
export const TOGGLE_FEATURE = 'userpreferences/TOGGLE_FEATURE'
export const toggleFeature = flag => ({
  type: TOGGLE_FEATURE,
  payload: { flag },
})

// reducers
const initialState = { featureFlags: { upload: true } }

const getReducer = ({ type, payload }) => {
  switch (type) {
    case TOGGLE_FEATURE:
      return R.over(flagLens(payload.flag), R.not)
    // case LOG_IN_SUCCESS:
    default:
      return R.identity
  }
}

export const reducer = (state = initialState, action) =>
  getReducer(action)(state)
