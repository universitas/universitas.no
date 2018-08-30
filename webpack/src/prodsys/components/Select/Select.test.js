import { Select } from './index'
import renderer from 'react-test-renderer'

describe('Select', () => {
  test('renders correctly', () => {
    const tree = renderer
      .create(<Select items={{ 1: { label: 'foo', value: '1' } }} />)
      .toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
