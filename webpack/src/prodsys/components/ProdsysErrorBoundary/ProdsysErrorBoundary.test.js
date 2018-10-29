import ProdsysErrorBoundary from './index'
import renderer from 'react-test-renderer'

describe('ProdsysErrorBoundary', () => {
  test('renders correctly', () => {
    const tree = renderer
      .create(
        <ProdsysErrorBoundary>
          <div>hello</div>
        </ProdsysErrorBoundary>,
      )
      .toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
