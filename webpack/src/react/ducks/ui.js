import R from 'ramda'

// action creators
const SELECT_APP = 'SELECT_APP'
export const selectApp = (appName, panelIndex) => ({
  type: SELECT_APP,
  payload: { appName, panelIndex },
})

// selectors
const getUi = R.prop('ui')
export const getActiveApp = R.compose(R.prop('activeApp'), getUi)

// reducers
const defaultState = { activeApp: 'stories' }
const reducer = (state, action) => {
  switch (action.type) {
    case SELECT_APP:
      return { ...state, activeApp: action.payload.activeApp }
    default:
      return state
  }
}

export default reducer
