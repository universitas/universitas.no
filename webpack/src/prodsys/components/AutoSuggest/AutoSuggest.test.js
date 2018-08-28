import AutoSuggest from './index'
import renderer from 'react-test-renderer'

describe('AutoSuggest', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<AutoSuggest />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
