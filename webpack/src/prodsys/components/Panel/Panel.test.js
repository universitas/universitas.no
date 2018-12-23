import Panel from './index'
import renderer from 'react-test-renderer'

describe('Panel', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<Panel />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
