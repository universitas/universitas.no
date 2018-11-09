import { toJson } from 'utils/text'
import Tingo from './Tingo'
import Debug from 'components/DevDebug'
import SlideShow from 'components/SlideShow'
import StoryImage from './StoryImage'
import StoryLink from './StoryLink'
import cx from 'classnames'

const SectionHeading = props => <h2 className="SectionHeading" {...props} />
const Subheading = props => <h3 className="Subheading" {...props} />
const AsideHeading = props => <h3 className="AsideHeading" {...props} />
const Paragraph = props => <p className="Paragraph" {...props} />
const Question = props => <p className="Question" {...props} />
const ListItem = props => <li className="ListItem" {...props} />

const PullQuote = props => <blockquote className="PullQuote" {...props} />
const QuoteCit = ({ children, props }) => (
  <div className="QuoteCit" {...props}>
    {children}
  </div>
)
const Aside = ({ children, ...props }) => (
  <aside className="Facts" {...props}>
    {children}
  </aside>
)

const Emphasis = props => <em {...props} />

const Place = ({ name, flags, children, ...props }) => {
  if (R.isEmpty(children)) return null
  return (
    <section className={cx('Place', flags)} id={name} {...props}>
      {children}
    </section>
  )
}

const BodySection = ({ children }) => (
  <section className="BodySection">{children}</section>
)

const Video = ({
  caption,
  creditline,
  video_host,
  host_video_id,
  aspect_ratio = 9 / 16,
}) => (
  <div className="storyVideo">
    <div
      className="videoWrapper"
      style={{ position: 'relative', paddingTop: `${100 * aspect_ratio}%` }}
    >
      <iframe
        style={{ position: 'absolute', top: '0' }}
        width="100%"
        height="100%"
        src={`https://youtube.com/embed/${host_video_id}?rel=0`}
        frameBorder="0"
        allowFullScreen
      />
    </div>
  </div>
)

const Embed = ({ bodytext_html }) => (
  <div
    className="Embed"
    style={{ width: '100%', overflow: 'hidden' }}
    dangerouslySetInnerHTML={{ __html: bodytext_html }}
  />
)

const typeMap = {
  aside: Aside,
  em: Emphasis,
  image: StoryImage,
  inline_html_block: Embed,
  link: StoryLink,
  listItem: ListItem,
  paragraph: Paragraph,
  place: Place,
  pullquote: PullQuote,
  section: BodySection,
  video: Video,
}

const tagMap = {
  faktatit: AsideHeading,
  mt: Subheading,
  sitatbyline: QuoteCit,
  spm: Question,
  tingo: Tingo,
  tit: SectionHeading,
  txt: Paragraph,
}

const splitContent = R.partition(
  R.pathSatisfies(R.flip(R.contains)(['image', 'video']), ['type']),
)

const renderNodes = R.addIndex(R.map)((node, idx) => {
  if (R.is(String, node)) return node
  if (node.type == 'place') {
    if (node.children && node.children.length) {
      const { children, tag, type, ...props } = node
      const [media, other] = splitContent(children)
      return (
        <Place {...props} key={idx}>
          {renderNodes(other)}
          <SlideShow>{renderNodes(media)}</SlideShow>
        </Place>
      )
    } else return null
  }
  let { children = [], ...props } = node
  if (node.type == 'aside' && R.pathEq([0, 'type'], 'paragraph')(children)) {
    children = R.pipe(
      R.assocPath([0, 'type'], 'blockTag'),
      R.assocPath([0, 'tag'], 'faktatit'),
    )(children)
  }
  const { tag, type } = props
  const Component = tag ? tagMap[tag] : typeMap[type]
  return Component ? (
    <Component {...props} key={idx}>
      {renderNodes(children)}
    </Component>
  ) : (
    <Debug {...node} key={idx} />
  )
})

const unflatten = tree => {
  const retval = []
  let children = []
  for (const node of tree) {
    if (node.type == 'place') {
      retval.push(node)
      children = []
    } else {
      if (children.length == 0) retval.push({ type: 'section', children })
      children.push(node)
    }
  }
  return retval
}

const StoryBody = ({ bodytext_markup, parseTree, nodeTree, ...props }) => {
  return <main>{renderNodes(unflatten(nodeTree))}</main>
}

export default StoryBody
