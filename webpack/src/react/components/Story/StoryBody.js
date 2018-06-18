import { toJson } from 'utils/text'
import { toShortUrl } from 'ducks/router'
import RouterLink from 'redux-first-router-link'
import Tingo from './Tingo'
import StoryImage from './StoryImage'

const Subheading = props => <h3 className="Subheading" {...props} />
const AsideHeading = props => <h3 className="AsideHeading" {...props} />
const Paragraph = props => <p className="Paragraph" {...props} />
const Question = props => <p className="Question" {...props} />
const ListItem = props => <li className="ListItem" {...props} />

const PullQuote = props => <blockquote className="PullQuote" {...props} />
const QuoteCit = props => <cit className="QuoteCit" {...props} />
const Aside = props => <aside className="Facts" {...props} />

const Place = ({ name, ...props }) => (
  <section title={name} className="Place" {...props} />
)

const Link = ({ link = {}, ...props }) => {
  const { linked_story, href } = link
  return linked_story ? (
    <RouterLink to={toShortUrl({ id: linked_story })} {...props} />
  ) : (
    <a
      style={{ textDecoration: 'underline' }}
      href={href}
      title={href}
      {...props}
    />
  )
}

const typeMap = {
  paragraph: Paragraph,
  place: Place,
  pullquote: PullQuote,
  link: Link,
  aside: Aside,
  listItem: ListItem,
  image: StoryImage,
}

const tagMap = {
  spm: Question,
  mt: Subheading,
  tit: Subheading,
  txt: Paragraph,
  tingo: Tingo,
  sitatbyline: QuoteCit,
  faktatit: AsideHeading,
}

const renderNodes = R.map(
  R.ifElse(R.is(String), R.identity, node => {
    const { children = [], ...props } = node
    const { tag, type } = props
    const Component = tag ? tagMap[tag] : typeMap[type]
    return Component ? (
      <Component title={toJson(node)} {...props}>
        {renderNodes(children)}
      </Component>
    ) : (
      <JSON {...node} />
    )
  }),
)

const StoryBody = ({ bodytext_markup, parseTree, nodeTree, ...props }) => {
  return <main>{renderNodes(nodeTree)}</main>
}

const JSON = props => (
  <div
    className="JSON"
    style={{
      background: '#010',
      borderRadius: '0.5em',
      color: '#af5',
      padding: '0.5em',
      fontFamily: 'monospace',
      fontSize: '0.7rem',
      lineHeight: 1.1,
      whiteSpace: 'pre-wrap',
      flex: 1,
      overflowY: 'auto',
    }}
  >
    {toJson(props)}
  </div>
)

export default StoryBody
