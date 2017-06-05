import React from 'react'
import { connect } from 'react-redux'
import { scrollElement } from './scroll'

const parser = text => {
  const nodes = text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(line => {
      const match = line.match(/^@(\S*):(.*)$/)
      return match
        ? { type: match[1], children: match[2] }
        : { type: 'txt', children: line }
    })
  return nodes
}

const Tittel = props => <h1 {...props} />
const Ingress = props => <p {...props} style={{ fontSize: '1.5em' }} />
const MellomTittel = props => <h3 {...props} />
const Brødtekst = props => <p {...props} />
const Spørsmål = props => (
  <p style={{ fontStyle: 'italic', fontWeight: 'bold' }} {...props} />
)
const Tingo = ({ n = 0, children, ...props }) => {
  const tingoPattern = n ? `(?:\\S+\\s+){1,${n}}` : '.{1,12}\\S*'
  const fullPattern = RegExp(`^(${tingoPattern})(.*)$`)
  if (typeof children == 'string') {
    const match = children.trim().match(fullPattern)
    if (match) {
      return (
        <p {...props}>
          <strong>{match[1]}</strong>{match[2]}
        </p>
      )
    }
  }
  return <p {...props}>{children}</p>
}

const elements = {
  tit: Tittel,
  ing: Ingress,
  txt: Brødtekst,
  spm: Spørsmål,
  mt: MellomTittel,
}

const Node = ({ type, scrollTo, ...props }) => {
  const isTingo = type.match(/^tingo(\d*)$/)
  let Element = elements[type]
  if (isTingo) {
    props.n = isTingo[1]
    Element = Tingo
  }
  if (Element === undefined) {
    Element = Brødtekst
    props.style = { color: 'red' }
    props.children = `@${type}: ${props.children}`
  }
  return (
    <div
      className={scrollTo ? 'block scrollTo' : 'block'}
      ref={scrollTo ? scrollElement : el => {}}
    >
      <Element {...props} />
    </div>
  )
}

const mapStateToProps = ({ text }) => ({
  nodes: parser(text.content),
  activeIndex: text.activeIndex,
})
const Preview = ({ nodes, activeIndex }) => {
  return (
    <section className="Preview">
      {nodes.map((node, index) => (
        <Node key={index} scrollTo={index == activeIndex} {...node} />
      ))}
    </section>
  )
}

export default connect(mapStateToProps, null)(Preview)
