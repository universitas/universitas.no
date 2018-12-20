import {
  baseInitialState,
  modelReducer,
  modelActions,
  modelSelectors,
} from './basemodel.js'
import { createStore, combineReducers } from 'redux'
import * as actions from './basemodel.js'

const modelName = 'sausages'
const itemData = { id: 100, bar: { foo: null } }
const {
  autosaveToggle,
  fieldChanged,
  filterSet,
  filterToggled,
  itemAdded,
  itemCreated,
  itemCreateFailed,
  itemDeleted,
  itemPatchFailed,
  itemPatchStart,
  itemPatchSuccess,
  itemPost,
  itemRequested,
  itemSave,
  itemsDiscarded,
  itemsFetched,
  itemsFetching,
  itemsRequested,
  paginate,
} = modelActions(modelName)

describe('setup', () => {
  test('initial state', () => {
    expect(baseInitialState()).toEqual({
      autosave: true,
      items: { '0': { _dirty: null, _error: null, _syncing: false } },
      query: {},
      pagination: { ids: [] },
    })
  })
})

describe('action creators', () => {
  const cases = [
    [autosaveToggle, actions.AUTOSAVE_TOGGLE, null, {}],
    [
      fieldChanged,
      actions.FIELD_CHANGED,
      [6, 'foo', 'bar'],
      { id: 6, field: 'foo', value: 'bar' },
    ],
    [filterSet, actions.FILTER_SET, ['foo', 2], { key: 'foo', value: 2 }],
    [
      filterToggled,
      actions.FILTER_TOGGLED,
      ['foo', 2],
      { key: 'foo', value: 2 },
    ],
    [filterSet, actions.FILTER_SET, ['foo', 2], { key: 'foo', value: 2 }],
    [itemAdded, actions.ITEM_ADDED, { foo: 'bar' }, { foo: 'bar' }],
    [itemCreateFailed, actions.ITEM_CREATE_FAILED, {}, {}],
    [itemCreated, actions.ITEM_CREATED, { foo: 'bar' }, { foo: 'bar' }],
    [itemDeleted, actions.ITEM_DELETED, 100, { id: 100 }],
    [itemPatchFailed, actions.ITEM_PATCH_FAILED, { error: {} }, { error: {} }],
    [itemPatchSuccess, actions.ITEM_PATCH_SUCCESS, { id: 100 }, { id: 100 }],
    [itemPost, actions.ITEM_POST, 100, { id: 100 }],
    [
      itemRequested,
      actions.ITEMS_REQUESTED,
      2,
      { params: { id__in: [2] }, replace: false },
    ],
    [itemsDiscarded, actions.ITEMS_DISCARDED, [2, 3], { ids: [2, 3] }],
    [itemsFetched, actions.ITEMS_FETCHED, itemData, itemData],
    [itemsFetching, actions.ITEMS_FETCHING, itemData, itemData],
    [
      itemsRequested,
      actions.ITEMS_REQUESTED,
      { q: '' },
      { params: { q: '' }, replace: false },
    ],
    [paginate, actions.PAGINATE, { a: 'b' }, { a: 'b' }],
  ]
  R.map(
    R.apply((actionCreator, type, args, payload) => {
      test(`action ${type}`, () => {
        expect(actionCreator).toBeDefined()
        expect(type).toBeDefined()
        const wrap = R.ifElse(R.is(Array), R.identity, R.of)
        const action = R.apply(actionCreator, wrap(args))
        expect(action).toEqual({
          type,
          payload,
          meta: { modelName },
        })
      })
    }),
  )(cases)
})

describe('reducer', () => {
  const reducer = combineReducers(R.objOf(modelName, modelReducer(modelName)))
  const initialState = R.objOf(modelName, baseInitialState())
  test('initial state', () => {
    expect(reducer({})).toEqual(initialState)
  })
  test('dispatch action on model', () => {
    expect(reducer({}, itemAdded(itemData))).toEqual(
      R.mergeDeepRight(
        initialState,
        R.objOf(modelName, {
          pagination: { ids: [itemData.id] },
          items: { [itemData.id]: itemData },
        }),
      ),
    )
  })
  test('dispatch action on other model', () => {
    expect(
      reducer(initialState, modelActions('spam').itemAdded(itemData)),
    ).toEqual(initialState)
  })
})

describe('selectors', () => {
  const modelData = {
    autosave: false,
    query: { foo: [1, 2, 3] },
    pagination: { next: 'a', previous: 'b', ids: [100, 101] },
    items: {
      '100': { id: 100 },
      '101': { id: 101, xxx: 'foo', _dirty: { xxx: 'bar' } },
      '102': { id: 102, _error: {}, _syncing: false },
      '103': { id: 103, _error: null, _syncing: true },
    },
  }
  const initialState = R.objOf(modelName, baseInitialState())
  const fixtureState = R.objOf(
    modelName,
    R.mergeRight(baseInitialState(), modelData),
  )

  const cases = [
    ['getAutosave', null, true, false],
    [
      'getChoices',
      null,
      [],
      R.map(n => ({ value: n, display_name: n }), [100, 101, 102, 103]),
    ],
    ['getDirty', 101, undefined, { xxx: 'bar' }],
    ['getItem', 101, {}, { id: 101, xxx: 'bar' }],
    ['getItemList', null, [], modelData.pagination.ids],
    ['getItemStatus', 100, 'not found', 'ok'],
    ['getItemStatus', 101, 'not found', 'dirty'],
    ['getItemStatus', 102, 'not found', 'error'],
    ['getItemStatus', 103, 'not found', 'syncing'],
    [
      'getItems',
      null,
      {},
      R.mergeLeft({ 101: { id: 101, xxx: 'bar' } }, modelData.items),
    ],
    ['getPagination', null, { ids: [] }, modelData.pagination],
    ['getQuery', null, {}, modelData.query],
  ]

  const selectors = modelSelectors(modelName)
  R.map(
    R.apply((funcname, args, data0, data1) => {
      let selector = selectors[funcname]
      if (args) selector = selector(args)
      test(`selector: ${funcname} intialState`, () => {
        expect(selector(initialState)).toEqual(data0)
      })
      test(`selector: ${funcname} fixtureState`, () => {
        expect(selector(fixtureState)).toEqual(data1)
      })
    }),
  )(cases)
})
