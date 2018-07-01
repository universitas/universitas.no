import { connect } from 'react-redux'
import { toStory, toShortUrl } from 'ducks/router'
import { getStory, storyRequested } from 'ducks/publicstory'
import RouterLink from 'redux-first-router-link'

const StoryLink = ({ href, story, id, storyRequested, ...props }) =>
  story ? (
    story.id ? (
      <RouterLink to={toStory(story)} {...props} />
    ) : (
      <RouterLink
        to={toShortUrl({ id })}
        onMouseOver={() => story.fetching || storyRequested(id, true)}
        {...props}
      />
    )
  ) : (
    <a
      style={{ textDecoration: 'underline' }}
      href={href}
      title={href}
      {...props}
    />
  )

const mapStateToProps = (state, props) => {
  const id = R.path(['link', 'linked_story'], props)
  const href = R.path(['link', 'href'], props)
  if (id) return { id, story: getStory(id)(state) || {} }
  return { href }
}
const mapDispatchToProps = { storyRequested }
export default connect(mapStateToProps, mapDispatchToProps)(StoryLink)
