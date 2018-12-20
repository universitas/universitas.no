import Detail from './StoryDetail.js'
import List from './StoryList.js'
import Tools from './StoryTools.js'
import { connect } from 'react-redux'
import { getPanes, togglePane } from 'prodsys/ducks/ux'
import { selectors } from './model.js'

const StoryRoute = ({ pk, action, panes }) => {
  const { storyText, storyImages, storyPreview } = panes
  const nPanes = [storyText, storyImages, storyPreview].filter(Boolean).length
  const children = []
  if (!pk || nPanes < 2)
    children.push(
      <List pk={pk} action={storyImages ? 'images' : action} key="list" />,
    )
  if (pk && storyPreview)
    children.push(<Detail pk={pk} action={'preview'} key="3" />)
  if (pk && storyImages)
    children.push(<Detail pk={pk} action={'images'} key="2" />)
  if ((pk && storyText) || nPanes == 0)
    children.push(<Detail pk={pk} action={'change'} key="1" />)
  children.push(<Tools pk={pk} action={action} key="tools" />)
  return children
}

const mapStateToProps = (state, { pk }) =>
  R.applySpec({
    panes: R.pipe(getPanes),
  })(state)

export default connect(mapStateToProps)(StoryRoute)
