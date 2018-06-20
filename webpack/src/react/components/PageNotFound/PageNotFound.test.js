import PageNotFound from './index'
import renderer from 'react-test-renderer'

describe('PageNotFound', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<PageNotFound />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
