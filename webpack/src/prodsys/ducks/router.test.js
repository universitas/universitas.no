import { reverse, forward, toLogin, toRoute, NOT_FOUND } from './router'

describe('simple routes', () => {
  test('reverse', () => {
    expect(reverse(toLogin())).toEqual('/login/')
  })
  test('forward', () => {
    expect(forward('/')).toMatchObject({ type: NOT_FOUND })
    expect(forward('/login/')).toMatchObject(toLogin())
  })
})

describe('reverse prodsys routes', () => {
  const cases = {
    '/stories/list/': { model: 'stories', action: 'list' },
    '/photos/add/': { model: 'photos', action: 'add' },
    '/photos/change/101/': { model: 'photos', action: 'change', pk: 101 },
    '/issues/list/?search=hello%20world': {
      model: 'issues',
      search: 'hello world',
    },
  }
  for (const [path, params] of Object.entries(cases)) {
    const action = toRoute(params)
    test(path, () => expect(reverse(action)).toEqual(path))
    test(path, () => expect(forward(path)).toMatchObject(action))
  }
})
