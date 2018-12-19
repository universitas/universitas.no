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
  itemAdded,
  itemCloned,
  itemDeleted,
  itemCreated,
  itemRequested,
  itemsRequested,
  itemsFetched,
  itemsDiscarded,
  filterToggled,
  filterSet,
  itemPatched,
  fieldChanged,
} = modelActions(modelName)

describe('setup', () => {
  test('initial state', () => {
    expect(baseInitialState()).toEqual({
      autosave: true,
      items: { '0': { _dirty: {}, _error: null, _status: 'ok' } },
      query: {},
      pagination: { ids: [] },
    })
  })
})

describe('action creators', () => {
  const cases = [
    [itemAdded, actions.ITEM_ADDED, itemData, itemData],
    [itemCloned, actions.ITEM_CLONED, 5, { id: 5 }],
    [itemDeleted, actions.ITEM_DELETED, 4, { id: 4 }],
    [itemCreated, actions.ITEM_CREATED, { foo: 'bar' }, { foo: 'bar' }],
    [
      itemRequested,
      actions.ITEMS_REQUESTED,
      2,
      { params: { id__in: [2] }, replace: false },
    ],
    [
      itemsRequested,
      actions.ITEMS_REQUESTED,
      { q: '' },
      { params: { q: '' }, replace: false },
    ],
    [itemsFetched, actions.ITEMS_FETCHED, itemData, itemData],
    [itemsDiscarded, actions.ITEMS_DISCARDED, [2, 3], { ids: [2, 3] }],
    [itemPatched, actions.ITEM_PATCHED, itemData, { ...itemData }],
    [
      fieldChanged,
      actions.FIELD_CHANGED,
      [6, 'foo', 'bar'],
      { id: 6, field: 'foo', value: 'bar' },
    ],
    [
      filterToggled,
      actions.FILTER_TOGGLED,
      ['foo', 2],
      { key: 'foo', value: 2 },
    ],
    [filterSet, actions.FILTER_SET, ['foo', 2], { key: 'foo', value: 2 }],
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
  const selectors = modelSelectors(modelName)
  const modelData = {
    autosave: true,
    query: { foo: [1, 2, 3] },
    pagination: { next: 'a', previous: 'b', ids: [100, 101] },
    items: { '100': { id: 100 }, '101': { id: 101 } },
  }
  const initialState = R.objOf(modelName, baseInitialState())
  const modelState = R.objOf(modelName, modelData)

  const cases = [
    ['getQuery', {}, modelData.query],
    ['getItemList', [], modelData.pagination.ids],
    ['getItems', {}, R.map(a => a, modelData.items)],
    ['getPagination', { ids: [] }, modelData.pagination],
    ['getItem', {}, { id: 101 }, 101],
  ]
  R.map(
    R.apply((funcname, data0, data1, args) => {
      let selector = selectors[funcname]
      if (args) selector = selector(args)
      test(`selector: ${funcname} intialState`, () => {
        expect(selector(initialState)).toEqual(data0)
      })
      test(`selector: ${funcname} modelState`, () => {
        expect(selector(modelState)).toEqual(data1)
      })
    }),
  )(cases)
})
