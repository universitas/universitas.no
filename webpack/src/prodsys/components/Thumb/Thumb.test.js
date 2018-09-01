import Thumb from './index'
import renderer from 'react-test-renderer'

describe('Thumb', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<Thumb />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
