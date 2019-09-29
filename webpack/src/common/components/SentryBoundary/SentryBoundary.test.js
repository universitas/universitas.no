import SentryBoundary from './index'
import renderer from 'react-test-renderer'

describe('SentryBoundary', () => {
  test('renders correctly', () => {
    const tree = renderer
      .create(
        <SentryBoundary>
          <div>hello</div>
        </SentryBoundary>,
      )
      .toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
