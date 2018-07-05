import { toJson } from 'utils/text'
import Tingo from './Tingo'
import Debug from 'components/Debug'
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
const QuoteCit = props => <div className="QuoteCit" {...props} />
const Aside = props => <aside className="Facts" {...props} />
const Emphasis = props => <em {...props} />

const Place = ({ name, flags, children, ...props }) => {
  if (R.isEmpty(children)) return <pre>{name}</pre>
  const [media, other] = R.partition(
    R.pathSatisfies(R.flip(R.contains)(['StoryImage', 'Video']), [
      'type',
      'displayName',
    ]),
    children,
  )
  return (
    <section title={name} className={cx('Place', flags)} {...props}>
      {media && <SlideShow>{media}</SlideShow>}
      {other}
    </section>
  )
}

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
  paragraph: Paragraph,
  place: Place,
  pullquote: PullQuote,
  link: StoryLink,
  aside: Aside,
  listItem: ListItem,
  image: StoryImage,
  video: Video,
  em: Emphasis,
  inline_html_block: Embed,
}

const tagMap = {
  tit: SectionHeading,
  mt: Subheading,
  txt: Paragraph,
  spm: Question,
  tingo: Tingo,
  sitatbyline: QuoteCit,
  faktatit: AsideHeading,
}

const renderNodes = R.addIndex(R.map)(
  R.ifElse(R.is(String), R.identity, (node, idx) => {
    const { children = [], ...props } = node
    const { tag, type } = props
    const Component = tag ? tagMap[tag] : typeMap[type]
    return Component ? (
      <Component {...props} key={idx}>
        {renderNodes(children)}
      </Component>
    ) : (
      <Debug {...node} />
    )
  }),
)

const StoryBody = ({ bodytext_markup, parseTree, nodeTree, ...props }) => {
  return <main>{renderNodes(nodeTree)}</main>
}

export default StoryBody
