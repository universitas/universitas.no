import { RelatedStory } from './RelatedStory.js'
import renderer from 'react-test-renderer'

describe('RelatedStory', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<RelatedStory />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
