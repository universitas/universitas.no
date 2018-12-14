import ZoomSlider from './index'
import renderer from 'react-test-renderer'

describe('ZoomSlider', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<ZoomSlider />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
