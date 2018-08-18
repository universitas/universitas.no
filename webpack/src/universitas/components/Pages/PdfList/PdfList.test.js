import PdfList from './index'
import renderer from 'react-test-renderer'

describe('PdfList', () => {
  test('renders correctly', () => {
    const tree = renderer.create(<PdfList />).toJSON()
    expect(tree).toEqual(expect.any(Object))
    expect(tree).toMatchSnapshot()
  })
})
