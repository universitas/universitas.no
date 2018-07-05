import SlideShow from './index'
import renderer from 'react-test-renderer'

describe('SlideShow', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<SlideShow />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
