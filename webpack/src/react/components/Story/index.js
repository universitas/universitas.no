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
import './Story.scss'

const Title = ({ title }) => <h1 className="Title"> {title} </h1>
const Lede = ({ lede }) => <p className="Lede"> {lede} </p>

export const Story = ({ redirect, ...props }) => {
  const action = toStory(props)
  if (props.pathname != reverse(action)) {
    redirect(action)
    return null
  }
  return (
    <article className="Story">
      <StoryHelmet {...props} />
      <StoryHead {...props} />
      <section className="mainContent">
        <StorySidebar {...props} />
        <StoryBody {...props} />
      </section>
    </article>
  )
}

const mapStateToProps = (state, { id }) => getStory(id)(state) || {}
const mapDispatchToProps = (dispatch, { id }) => ({
  fetchData: () => dispatch(storyRequested(id)),
  redirect: action => dispatch(redirect(action)),
})

export default connect(mapStateToProps, mapDispatchToProps)(
  requestData(Story, 'title', props => <LoadingIndicator {...props} />),
)
