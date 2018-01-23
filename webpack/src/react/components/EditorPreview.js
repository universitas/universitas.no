import { connect } from 'react-redux'
import { scrollElement } from 'utils/scroll'
import { getNodes, getActiveIndex } from 'ducks/editor'

const Tingo = (n = 0, { children, ...props }) => {
  const tingoPattern = n ? `(?:\\S+\\s+){1,${n}}` : '.{1,12}\\S*'
  const fullPattern = RegExp(`^(${tingoPattern})(.*)$`)
  const text = children[0]
  if (typeof text == 'string') {
    const match = text.trim().match(fullPattern)
    if (match) {
      return (
        <p className="tingo" {...props}>
          <span className="inngangsord">{match[1]}</span>
          {match[2]}
        </p>
      )
    }
  }
  return <p {...props}>{text}</p>
}

const Link = ({ target, ...props }) => (
  <a href={target} title={target} {...props} />
)

const elements = {
  tit: props => <h1 {...props} />,
  ing: props => <p {...props} style={{ fontSize: '1.5em' }} />,
  txt: props => <p {...props} />,
  spm: props => <p className="question" {...props} />,
  //  link: props => <em {...props} />,
  mt: props => <h3 className="mellomtittel" {...props} />,
  tingo: Tingo.bind(null, 0),
  tingo1: Tingo.bind(null, 1),
  tingo2: Tingo.bind(null, 2),
  tingo3: Tingo.bind(null, 3),
  tingo4: Tingo.bind(null, 4),
  tingo5: Tingo.bind(null, 5),
  link: Link,
  ol: props => <ol {...props} />,
  ul: props => <ul {...props} />,
  li: props => <li {...props} />,
  em: props => <em {...props} />,
  span: props => <span {...props} />,
  strong: props => <strong {...props} />,
}

const Node = ({ type, children, ...props }) => {
  let Element = elements[type]
  if (Element === undefined) {
    props.style = { fontWeight: 'bolder', color: 'red' }
    if (typeof children === 'object') {
      Element = elements.txt
      children = [{ type: '', children: `@${type}: ` }, ...children]
    } else {
      Element = elements.em
    }
  }
  const renderChild = (props, key) => {
    return props.type ? <Node key={key} {...props} /> : props.children
  }
  return <Element {...props}>{children.map(renderChild)}</Element>
}

const NodeWrapper = ({ scrollTo, ...props }) =>
  scrollTo ? (
    <div className="scrollTo" ref={scrollElement}>
      <Node {...props} />
    </div>
  ) : (
    <Node {...props} />
  )

const EditorPreview = ({ nodes, activeIndex }) => {
  return (
    <section className="EditorPreview">
      {nodes.map(({ index, ...props }) => (
        <NodeWrapper key={index} scrollTo={index == activeIndex} {...props} />
      ))}
    </section>
  )
}

const mapStateToProps = R.applySpec({
  nodes: getNodes,
  activeIndex: getActiveIndex,
})

export default connect(mapStateToProps)(EditorPreview)
