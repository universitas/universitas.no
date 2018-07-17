import PageSwitch from './index'
import renderer from 'react-test-renderer'

describe('PageSwitch', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<PageSwitch />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
