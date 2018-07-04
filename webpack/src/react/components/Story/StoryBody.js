import { toJson } from 'utils/text'
import Tingo from './Tingo'
import Debug from 'components/Debug'
import StoryImage from './StoryImage'
import StoryLink from './StoryLink'

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

const Place = ({ name, ...props }) => (
  <section title={name} className="Place" {...props} />
)

const typeMap = {
  paragraph: Paragraph,
  place: Place,
  pullquote: PullQuote,
  link: StoryLink,
  aside: Aside,
  listItem: ListItem,
  image: StoryImage,
  em: Emphasis,
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