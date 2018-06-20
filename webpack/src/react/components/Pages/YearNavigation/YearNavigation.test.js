import YearNavigation from './index'
import renderer from 'react-test-renderer'

describe('YearNavigation', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<YearNavigation />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
