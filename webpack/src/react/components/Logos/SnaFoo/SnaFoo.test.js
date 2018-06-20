import SnaFoo from './index'
import renderer from 'react-test-renderer'

describe('SnaFoo', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<SnaFoo />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
