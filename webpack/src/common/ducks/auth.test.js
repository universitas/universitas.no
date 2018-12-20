import { createStore, combineReducers } from 'redux'
import {
  getUser,
  getAuthToken,
  getPermission,
  logOut,
  logIn,
  loginSuccess,
  loginFailed,
  requestUserSuccess,
  requestUserFailed,
  LOG_IN,
  LOG_IN_SUCCESS,
  LOG_IN_FAILED,
  LOG_OUT,
  REQUEST_USER,
  REQUEST_USER_FAILED,
  REQUEST_USER_SUCCESS,
  reducer as authReducer,
} from './auth.js'

const reducer = combineReducers({ auth: authReducer })

const fixtures = {}
const initialState = reducer()

describe('initial state', () => {
  test('selectors', () => {
    expect(getUser(initialState)).toEqual({ error: {}, pending: true })

    expect(getAuthToken(initialState)).toBeUndefined()
    expect(getPermission('change_story')(initialState)).toBe(false)
  })
})

describe('login', () => {
  test('login', () => {
    const loginAction = logIn('root', 'hunter2')
    expect(loginAction).toEqual({
      type: LOG_IN,
      payload: { username: 'root', password: 'hunter2' },
    })
    let state = reducer(initialState, loginAction)
    expect(getUser(state)).toMatchObject({ pending: true })
  })
})

describe('permissions', () => {
  const response = {
    pk: 42,
    username: 'foobar',
    permissions: ['change_story', 'add_story', 'change_user'],
  }
  test('not logged in', () => {
    const state = initialState
    expect(getPermission('change story')(state)).toBe(false)
    expect(getPermission('add story')(state)).toBe(false)
    expect(getPermission('delete story')(state)).toBe(false)
  })
  test('logged in', () => {
    const state = reducer(initialState, requestUserSuccess(response))
    expect(getUser(state)).toMatchObject({
      permissions: {
        story: { add: true, change: true },
        user: { change: true },
      },
    })
    expect(getPermission('change story')(state)).toBe(true)
    expect(getPermission('add story')(state)).toBe(true)
    expect(getPermission('delete story')(state)).toBe(false)
    expect(getPermission('change story')(state)).toBe(true)
    expect(getPermission('change user')(state)).toBe(true)
  })
})
