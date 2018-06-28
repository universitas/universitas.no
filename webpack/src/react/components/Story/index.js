import { connect } from 'react-redux'
import LoadingIndicator from 'components/LoadingIndicator'
import { requestData } from 'utils/hoc'
import { getStory, storyRequested } from 'ducks/publicstory'
import { reverse, toStory } from 'ducks/router'
import { redirect } from 'redux-first-router'
import StoryHelmet from './StoryHelmet.js'
import StoryHead from './StoryHead.js'
import StoryBody from './StoryBody.js'
import StorySidebar from './StorySidebar.js'
import StoryFoot from './StoryFoot.js'
import PageNotFound from 'components/PageNotFound'
import Debug from 'components/Debug'
import './Story.scss'

export const Story = props => (
  <article className="Story">
    <StoryHead {...props} />
    <main className="mainContent">
      <StorySidebar {...props} />
      <StoryBody {...props} />
    </main>
    <StoryFoot {...props} />
  </article>
)

const StoryRoute = ({ redirect, ...props }) => {
  if (props.HTTPstatus == 404)
    return <PageNotFound {...props}>Fant ikke saken</PageNotFound>

  const routeAction = toStory(props)
  if (props.pathname != reverse(routeAction)) {
    redirect(routeAction)
    return null
  }
  return [
    <StoryHelmet key="helmet" {...props} />,
    <Story key="story" {...props} />,
  ]
}

const mapStateToProps = (state, { id }) => getStory(id)(state) || {}
const mapDispatchToProps = (dispatch, { id }) => ({
  fetchData: () => dispatch(storyRequested(id)),
  redirect: routeAction => dispatch(redirect(routeAction)),
})

export default connect(mapStateToProps, mapDispatchToProps)(
  requestData(StoryRoute, 'url', LoadingIndicator),
)
