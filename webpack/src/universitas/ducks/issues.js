const sliceLens = R.lensProp('issues')

// Selectors
export const getIssues = R.view(sliceLens)

// Actions
export const ISSUES_REQUESTED = 'issues/ISSUES_REQUESTED'
export const issuesRequested = () => ({ type: ISSUES_REQUESTED, payload: {} })

export const ISSUES_FETCHED = 'issues/ISSUES_FETCHED'
export const issuesFetched = ({ results }) => ({
  type: ISSUES_FETCHED,
  payload: { issues: results },
})

// Reducer
const initialState = { fetching: false }
const getReducer = ({ type, payload, error }) => {
  switch (type) {
    case ISSUES_REQUESTED:
      return R.assoc('fetching', true)
    case ISSUES_FETCHED:
      return R.compose(
        R.assoc('fetching', false),
        R.merge(payload),
      )
    default:
      return R.identity
  }
}

export default (state = initialState, action) => getReducer(action)(state)
