import './Block.scss'
import { toJson } from 'utils/text'
import { withErrorBoundary } from 'react-error-boundary'
import cx from 'classnames'

const divideChildren = children => {
  if (R.is(String, children)) return [children, null]
  const [first, ...rest] = children
  return [first, rest]
}

const Tingo = ({ children }) => {
  const [first, rest] = divideChildren(children)
  const parts = R.is(String, first)
    ? R.match(/^([^;!?.]{1,15}\S*)(.*)$/, first)
    : []
  if (parts[1]) {
    return (
      <p className="Tingo">
        <strong>{parts[1]}</strong>
        {parts[2]}
        {rest}
      </p>
    )
  } else {
    return (
      <p className="Tingo">
        <strong>{first}</strong>
        {rest}
      </p>
    )
  }
}

export const FallBack = ({ children, tag, ...props }) => (
  <p className={cx('FallBack', tag)} title={toJson({ tag, ...props })}>
    {tag && `@${tag}: `}
    {children}
  </p>
)

const blockComponents = {
  tit: ({ children }) => <h1 className="tit">{children}</h1>,
  ing: ({ children }) => <p className="lede">{children}</p>,
  mt: ({ children }) => <h3 className="mt">{children}</h3>,
  bold: ({ children }) => <p className="bold">{children}</p>,
  spm: ({ children }) => <p className="spm">{children}</p>,
  tingo: Tingo,
  li: ({ children }) => <li>{children}</li>,
  txt: ({ children }) => <p>{children}</p>,
}

const Block = props => (blockComponents[props.tag] || FallBack)(props)

export default Block
