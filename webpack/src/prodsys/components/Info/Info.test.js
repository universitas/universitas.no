import Info from './index'
import renderer from 'react-test-renderer'

describe('Info', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<Info />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
