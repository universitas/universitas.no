import * as fileupload from './fileupload'
import { createStore, combineReducers } from 'redux'

const {
  uploadAdd,
  toggleUpdateAll,
  getUpdateAll,
  getUploadPKs,
  getUpload,
  getStoryChoices,
  uploadUpdate,
} = fileupload

const reducer = combineReducers({ fileupload: fileupload.reducer })

const fixtures = [
  { md5: 'aaa', filename: 'aaa.jpg', artist: '', description: '' },
  {
    md5: 'bbb',
    filename: 'bbb.jpg',
    artist: 'Foo Bar',
    description: 'caption B',
  },
  {
    md5: 'ccc',
    filename: 'ccc.png',
    artist: 'Foo Bar',
    description: 'caption C',
  },
]

describe('initial state', () => {
  test('initial state', () => {
    expect(reducer().fileupload).toEqual({ updateAll: false, items: [] })
  })
})

test('update all toggle', () => {
  const action = toggleUpdateAll()
  expect(action).toEqual({ type: fileupload.TOGGLE_UPDATE_ALL })
  let state = reducer(undefined, undefined) // initialize state
  expect(getUpdateAll(state)).toBe(false)
  state = reducer(state, action)
  expect(getUpdateAll(state)).toBe(true)
  state = reducer(state, action)
  expect(getUpdateAll(state)).toBe(false)
})

test('add upload item', () => {
  const action = uploadAdd(fixtures[0])
  const item_one = fixtures[0]
  expect(action).toEqual({
    type: fileupload.ADD,
    payload: { ...item_one, pk: item_one.md5 },
  })
  let state = reducer(undefined, action)
  expect(getUploadPKs(state)).toEqual(['aaa'])
  expect(getUpload('aaa')(state)).toMatchObject(fixtures[0])
})

test('upload multiple items', () => {
  let state = R.reduce(reducer, undefined, R.map(uploadAdd, fixtures))
  expect(getUploadPKs(state)).toEqual(['ccc', 'bbb', 'aaa'])
})

test('update items', () => {
  const state = R.reduce(reducer, undefined, R.map(uploadAdd, fixtures))
  const change = { description: 'caption A' }
  const updateAction = uploadUpdate('aaa', change, false, false)
  expect(updateAction.payload).toMatchObject({
    ...change,
    pk: 'aaa',
    single: false,
    verify: false,
  })
  let newState = reducer(state, updateAction)

  // both A and B were updated
  expect(getUpload('aaa')(newState)).toMatchObject({
    ...fixtures[0],
    ...change,
  })
  expect(getUpload('bbb')(newState)).toMatchObject({
    ...fixtures[1],
    ...change,
  })
  // update single item only
  newState = reducer(state, uploadUpdate('aaa', change))
  // only item A was changed
  expect(getUpload('aaa')(newState).description).toBe('caption A')
  expect(getUpload('bbb')(newState).description).toBe('caption B')
})

test('story choices', () => {
  const state = { stories: { items: {} } }
  expect(getStoryChoices(state)).toEqual([])
  state.stories.items = {
    '1': { publication_status: 0, id: 1, working_title: 'q foo' },
    '2': { publication_status: 4, id: 2, working_title: 'c foo' },
    '4': { publication_status: 5, id: 4, working_title: 'a foo' },
    '5': { publication_status: 9, id: 5, working_title: 'x foo' },
    '3': { publication_status: 5, id: 3, working_title: 'b foo' },
  }

  expect(getStoryChoices(state)).toEqual([
    { display_name: 'a foo', value: 4 },
    { display_name: 'b foo', value: 3 },
    { display_name: 'c foo', value: 2 },
  ])
})
