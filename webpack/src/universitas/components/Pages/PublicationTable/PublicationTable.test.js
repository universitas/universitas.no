import PublicationTable from './index'
import renderer from 'react-test-renderer'

describe('PublicationTable', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<PublicationTable />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
