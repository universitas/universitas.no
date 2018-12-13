// ducks for redux-first-router of prodsys

import {
  NOT_FOUND,
  redirect,
  actionToPath,
  pathToAction,
} from 'redux-first-router'
import { querySerializer } from 'utils/urls'
import restoreScroll from 'redux-first-router-restore-scroll'

const BASENAME = '/prodsys/'
export const SLICE = 'router'

export const routerOptions = {
  location: SLICE,
  basename: BASENAME,
  restoreScroll: restoreScroll(),
}

// Action constants
export const LOGIN = 'router/LOGIN'
export const PRODSYS = 'router/PRODSYS'
export { NOT_FOUND }

// url routes action mappings to configure redux-first-router
export const routesMap = {
  [LOGIN]: '/login/',
  [PRODSYS]: '/:model/:action/:pk(\\d+)?/',
  'router/SHORT_URL': {
    path: '/short/:id(\\d+)?/',
    thunk: (dispatch, getState) => {
      const { id: pk } = getRoutePayload(getState())
      const action = redirect(
        toRoute({ model: 'stories', action: 'preview', pk }),
      )
      return dispatch(action)
    },
  },
  [NOT_FOUND]: {
    thunk: (dispatch, getState) => dispatch(toRoute({})),
  },
}

// Action creators
export const toLogin = () => ({ type: LOGIN, payload: {} })
export const toRoute = ({ model = 'stories', action, pk, search }) => {
  const payload = {
    model,
    pk,
    action: action || (pk ? 'change' : 'list'),
  }
  const value = { type: PRODSYS, payload }
  if (search) value.meta = { query: { search } }
  return value
}

// selector for route location object
export const getRoute = R.prop(SLICE)
export const getRoutePayload = R.path([SLICE, 'payload'])
export const getRouteQuery = R.path([SLICE, 'meta', 'query'])

// low level utils for testing
// {action} -> "relative url"
export const reverse = action => {
  return actionToPath(action, routesMap, querySerializer)
}

// "relative url" -> {action}
export const forward = path => pathToAction(path, routesMap, querySerializer)
