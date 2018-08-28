import Select from './index'
import renderer from 'react-test-renderer'

describe('Select', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<Select />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
