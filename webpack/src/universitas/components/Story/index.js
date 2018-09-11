import { connect } from 'react-redux'
import cx from 'classnames'
import LoadingIndicator from 'components/LoadingIndicator'
import { requestData } from 'utils/hoc'
import { getStory, storiesRequested, storyRequested } from 'ducks/publicstory'
import { buildNodeTree } from 'markup/nodeTree'
import { reverse, toStory } from 'universitas/ducks/router'
import { redirect } from 'redux-first-router'
import StoryHelmet from './StoryHelmet.js'
import StoryHead from './StoryHead.js'
import StoryBody from './StoryBody.js'
import StorySidebar from './StorySidebar.js'
import StoryFoot from './StoryFoot.js'
import PageNotFound from 'components/PageNotFound'
import Debug from 'components/Debug'
import './Story.scss'

class Story extends React.Component {
  constructor(props) {
    super(props)
    const routeAction = toStory(props)
    if (props.pathname != reverse(routeAction)) {
      props.redirect(routeAction)
    }
  }
  componentDidMount() {
    if (this.props.related_stories)
      this.props.fetchRelated(this.props.related_stories)
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id == this.props.id) return
    if (this.props.related_stories)
      this.props.fetchRelated(this.props.related_stories)
  }

  render() {
    const { className, ...props } = this.props
    if (props.HTTPstatus == 404)
      return <PageNotFound {...props}>Fant ikke saken</PageNotFound>
    const tree = buildNodeTree(props)
    return (
      <article className={cx('Story', className)}>
        <StoryHelmet {...props} />
        <StoryHead {...tree} />
        <main className="mainContent">
          <StorySidebar {...tree} />
          <StoryBody {...tree} />
        </main>
        <StoryFoot {...props} />
      </article>
    )
  }
}

const mapStateToProps = (state, { id }) => R.defaultTo({}, getStory(id)(state))
const mapDispatchToProps = (dispatch, { id }) => ({
  fetchData: () => dispatch(storyRequested(id)),
  fetchRelated: related_stories => dispatch(storiesRequested(related_stories)),
  redirect: routeAction => dispatch(redirect(routeAction)),
})

export default connect(mapStateToProps, mapDispatchToProps)(
  requestData(Story, 'HTTPstatus', LoadingIndicator),
)
