import { FrontpageEdit } from './FrontpageEdit.js'

import renderer from 'react-test-renderer'

describe('FrontpageEdit', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<FrontpageEdit />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
