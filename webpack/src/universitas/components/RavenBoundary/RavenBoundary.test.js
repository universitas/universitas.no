import RavenBoundary from './index'
import renderer from 'react-test-renderer'

describe('RavenBoundary', () => {
  test('renders correctly', () => {
    const tree = renderer
      .create(
        <RavenBoundary>
          <div>hello</div>
        </RavenBoundary>,
      )
      .toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
