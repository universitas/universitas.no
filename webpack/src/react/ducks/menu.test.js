import * as menu from 'ducks/menu'
import { queryString } from 'utils/urls'
import { combineReducers } from 'redux'
const {
  initialState,
  toggleLanguage,
  searchQuery,
  toggleSection,
  onlySection,
  getFrontpageQuery,
  getMenu,
} = menu

const reducer = combineReducers({ menu: menu.reducer })

test('initial state', () => {
  const state = reducer()
  expect(getMenu(state)).toEqual(menu.initialState)
})

test('toggleLanguage', () => {
  const action = toggleLanguage('eng')
  expect(action).toEqual({
    type: menu.TOGGLE_LANGUAGE,
    payload: { language: 'eng' },
  })
  let state = reducer()
  expect(getMenu(state).language.eng).toBeFalsy()
  state = reducer(state, action)
  expect(getMenu(state).language.eng).toBeTruthy()
  state = reducer(state, action)
  expect(getMenu(state).language.eng).toBeFalsy()
})

test('toggleSection', () => {
  const action = toggleSection(1)
  expect(action).toEqual({
    type: menu.TOGGLE_SECTION,
    payload: { section: 1 },
  })
  let state = reducer()
  expect(getMenu(state).section).toEqual({})
  state = reducer(state, action)
  expect(getMenu(state).section).toEqual({ '1': true })
  state = reducer(state, action)
  expect(getMenu(state).section).toEqual({ '1': false })
  state = reducer(state, toggleSection(2))
  expect(getMenu(state).section).toEqual({ '1': false, '2': true })
})

test('onlySection', () => {
  let state = reducer(undefined, onlySection(1))
  expect(getMenu(state).section).toEqual({ '1': true })
  state = reducer(undefined, onlySection(2))
  expect(getMenu(state).section).toEqual({ '2': true })
})

test('searchQuery', () => {
  const action = searchQuery('foo')
  expect(action).toEqual({
    type: menu.SEARCH_QUERY,
    payload: { search: 'foo' },
  })
  const state = reducer(undefined, action)
  expect(getMenu(state).search).toEqual('foo')
})

test('getFrontpageQuery', () => {
  expect(getFrontpageQuery(reducer())).toEqual({ language: ['nor'] })
  const menuState = {
    search: 'foobar',
    section: { '1': true, '2': false, '3': false, '4': true },
    language: { eng: true, nor: true },
  }
  const query = getFrontpageQuery(reducer({ menu: menuState }))
  expect(query).toEqual({
    search: 'foobar',
    section: ['1', '4'],
    language: ['eng', 'nor'],
  })
  expect(queryString(query)).toEqual(
    'search=foobar&section=1,4&language=eng,nor'
  )
})
