import Strossle from './index'
import renderer from 'react-test-renderer'

describe('Strossle', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<Strossle />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
