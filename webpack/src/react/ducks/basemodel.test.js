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
  itemSelected,
  itemDeSelected,
  itemPatched,
  fieldChanged,
  itemRequested,
  itemsRequested,
  itemsFetched,
  filterToggled,
  filterSet,
} = modelActions(modelName)

describe('setup', () => {
  test('initial state', () => {
    expect(baseInitialState()).toEqual({
      currentItem: 0,
      currentItems: [],
      items: {},
      query: {},
      navigation: {},
    })
  })
})

describe('action creators', () => {
  const cases = [
    [itemAdded, actions.ITEM_ADDED, itemData, itemData],
    [itemCloned, actions.ITEM_CLONED, 5, { id: 5 }],
    [itemSelected, actions.ITEM_SELECTED, [5], { id: 5 }],
    [itemDeSelected, actions.ITEM_SELECTED, [], { id: 0 }],
    [
      itemPatched,
      actions.ITEM_PATCHED,
      itemData,
      { ...itemData, dirty: false },
    ],
    [fieldChanged, actions.FIELD_CHANGED, [6, 'foo', 'bar'], {}],
    [itemRequested, actions.ITEM_REQUESTED, 2, { id: 2 }],
    [itemsRequested, actions.ITEMS_REQUESTED, { q: '' }, { params: { q: '' } }],
    [itemsFetched, actions.ITEMS_FETCHED, itemData, itemData],
    [filterToggled, actions.FILTER_TOGGLED, ['foo', 2], { key: 'foo' }],
    [filterSet, actions.FILTER_SET, ['foo', 2], { key: 'foo', value: 2 }],
  ]
  R.map(
    R.apply((actionCreator, type, args, payload) => {
      test(`action ${type}`, () => {
        const wrap = R.ifElse(R.is(Array), R.identity, R.of)
        const action = R.apply(actionCreator, wrap(args))
        expect(action).toMatchObject({
          type,
          payload,
          meta: { modelName },
        })
      })
    })
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
          currentItems: [itemData.id],
          items: { [itemData.id]: itemData },
        })
      )
    )
  })
  test('dispatch action on other model', () => {
    expect(
      reducer(initialState, modelActions('spam').itemAdded(itemData))
    ).toEqual(initialState)
  })
})

describe('selectors', () => {
  const selectors = modelSelectors(modelName)
  const modelData = {
    query: { foo: [1, 2, 3] },
    navigation: { next: 'a', previous: 'b' },
    currentItem: 100,
    currentItems: [100, 101],
    items: { '100': { id: 100 }, '101': { id: 101 } },
  }
  const initialState = R.objOf(modelName, baseInitialState())
  const modelState = R.objOf(modelName, modelData)

  const cases = [
    ['getQuery', {}, modelData.query],
    ['getItemList', [], modelData.currentItems],
    ['getItems', {}, modelData.items],
    ['getCurrentItemId', 0, modelData.currentItem],
    ['getNavigation', {}, modelData.navigation],
    ['getCurrentItem', {}, modelData.items['100']],
    ['getItem', {}, modelData.items['101'], 101],
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
    })
  )(cases)
})
