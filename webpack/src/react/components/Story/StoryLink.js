import { connect } from 'react-redux'
import { toStory, toShortUrl } from 'ducks/router'
import { getStory, storyRequested } from 'ducks/publicstory'
import RouterLink from 'redux-first-router-link'

const StoryLink = ({ href, story, id, storyRequested, ref, children }) =>
  story ? (
    <RouterLink
      className="internal"
      to={story.id ? toStory(story) : toShortUrl({ id })}
      children={children}
      title={story.title || id}
    />
  ) : href ? (
    <a className="external" href={href} title={href} children={children} />
  ) : children.length ? (
    `[${children}]`
  ) : null

const mapStateToProps = (state, props) => {
  const id = R.path(['link', 'linked_story'], props)
  const href = R.path(['link', 'href'], props)
  if (props.ref) console.error('unexpected ref')
  if (id) return { id, story: getStory(id)(state) || {} }
  return { href }
}
const mapDispatchToProps = { storyRequested }
export default connect(mapStateToProps, mapDispatchToProps)(StoryLink)
