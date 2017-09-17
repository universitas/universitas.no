import {
  baseInitialState,
  modelReducer,
  modelActions,
  modelSelectors,
} from './basemodel.js'
import * as actions from './basemodel.js'

describe('setup', () => {
  test('initial state', () => {
    expect(baseInitialState()).toEqual({
      currentItem: 0,
      currentItems: [],
      query: {},
      navigation: {},
    })
  })
})

describe('action creators', () => {
  console.log('LOGGGG')
  const modelName = 'sausages'
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
  const data = { id: 100, data: { foo: null } }
  const cases = [
    [itemAdded, actions.ITEM_ADDED, data, data],
    [itemCloned, actions.ITEM_CLONED, 5, { id: 5 }],
    [itemSelected, actions.ITEM_SELECTED, [5], { id: 5 }],
    [itemDeSelected, actions.ITEM_SELECTED, [], { id: 0 }],
    [itemPatched, actions.ITEM_PATCHED, data, { ...data, dirty: false }],
    [fieldChanged, actions.FIELD_CHANGED, [6, 'foo', 'bar'], {}],
  ]
  R.map(
    R.apply((actionCreator, type, args, payload) => {
      test(`action ${type}`, () => {
        const action = R.ifElse(
          R.is(Array),
          R.apply(actionCreator),
          actionCreator
        )(args)
        console.log('action:', action)
        expect(action).toMatchObject({
          type,
          payload,
          meta: { modelName },
        })
      })
    })
  )(cases)
})
