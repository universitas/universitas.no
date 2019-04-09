import { connect } from 'react-redux'
import { toStory, toShortUrl } from 'universitas/ducks/router'
import { getStory, storyRequested } from 'ducks/publicstory'
import RouterLink from 'redux-first-router-link'
import { formatDate } from 'utils/text'

const linkTitle = ({ title, story_type = {}, publication_date }) =>
  title
    ? `${title}\n${story_type.name}, ${formatDate(publication_date)}`
    : 'lenke'

const StoryLink = ({ href, story, id, storyRequested, ref, children }) =>
  story ? (
    <RouterLink
      className="internal"
      to={story.id ? toStory(story) : toShortUrl({ id })}
      children={children}
      title={story.id ? linkTitle(story) : id}
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
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StoryLink)
