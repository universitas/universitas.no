import { FileInputButton } from './index'
import renderer from 'react-test-renderer'

describe('FileInputButton', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<FileInputButton />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
