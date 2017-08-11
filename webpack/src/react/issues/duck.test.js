import * as issues from './duck'

const fetchData = [
  { results: [{ id: 1 }, { id: 2 }] },
  { results: [{ id: 2 }, { id: 3 }] },
]

describe('reducer', () => {
  const initialState = issues.reducer(undefined, {})
  test('initial state', () => {
    expect(initialState).toEqual({
      currentItems: [],
      currentItem: 0,
      query: {},
    })
  })
  test('items fetched', () => {
    let action = issues.issuesFetched(fetchData[0])
    let newState = issues.reducer(initialState, action)
    expect(newState).toMatchObject({
      currentItems: [1, 2],
      items: { '1': { id: 1 }, '2': { id: 2 } },
    })
    action = issues.issuesFetched(fetchData[1])
    newState = issues.reducer(newState, action)
    expect(newState).toMatchObject({
      currentItems: [2, 3],
      items: { '1': { id: 1 }, '3': { id: 3 } },
    })
  })
  test('item selected', () => {
    let action = issues.issueSelected(10)
    let newState = issues.reducer(undefined, action)
    expect(newState).toMatchObject({
      currentItem: 10,
    })
  })
  test('item added', () => {
    const item = { id: 99, url: 'foo' }
    const action = issues.issueAdded(item)
    const state = { issues: issues.reducer(initialState, action) }
    expect(issues.getIssue(item.id)(state)).toEqual(item)
  })
  test('filter toggled', () => {
    let action = issues.filterToggled('q', 'foo')
    expect(action.payload).toMatchObject({ key: 'q', value: 'foo' })
    const state = issues.reducer(initialState, action)
    // toggle on
    expect(state).toMatchObject({ query: { q: 'foo' } })
    // toggle off
    expect(issues.reducer(state, action)).toMatchObject({ query: {} })
  })
})

describe('selectors', () => {
  test('initial state', () => {
    const state = { issues: issues.initialState }
    expect(issues.getIssueList(state)).toEqual([])
    expect(issues.getCurrentIssueId(state)).toEqual(0)
    expect(issues.getQuery(state)).toEqual({})
    expect(issues.getIssue(5)(state)).toBeUndefined()
  })
  test('item selector', () => {
    const item = { id: 5, name: 'foo' }
    const state = { issues: { items: { '5': item } } }
    expect(issues.getIssue(5)(state)).toEqual(item)
    expect(issues.getIssue(1)(state)).toBeUndefined()
  })
})
