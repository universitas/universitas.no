import { connect } from 'react-redux'
import LoadingIndicator from 'components/LoadingIndicator'
import { requestData } from 'utils/hoc'
import { getStory, storyRequested } from 'ducks/publicstory'
import { reverse, toStory } from 'ducks/router'
import { redirect } from 'redux-first-router'
import StoryHelmet from './StoryHelmet.js'

const Title = ({ title }) => <h1 className="Title"> {title} </h1>
const Lede = ({ lede }) => <p className="Lede"> {lede} </p>

export const Story = ({ redirect, ...props }) => {
  const action = toStory(props)
  if (props.pathname != reverse(action)) {
    redirect(action)
    return null
  }
  return (
    <article className="StoryPage">
      <StoryHelmet {...props} />
      <Title {...props} />
      <Lede {...props} />
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
