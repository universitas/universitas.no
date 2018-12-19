import ReactDOM from 'react-dom'
import { Spring } from 'react-spring'
import { timeoutDebounce as debounce } from 'utils/misc'

const inheritStyles = (sourceDoc, targetDoc) => {
  // copy css style sheets and links from parent document to IFrame
  for (const node of sourceDoc.head.children) {
    if (node.tagName == 'LINK' || node.tagName == 'STYLE')
      targetDoc.head.appendChild(node.cloneNode(true))
  }
}

function throttle(callback, limit) {
  let wait = false
  return function() {
    if (!wait) {
      callback()
      wait = true
      setTimeout(() => {
        wait = false
      }, limit)
    }
  }
}
// create window resize event for children to recalculate stuff
const resizeSignal = () => window.dispatchEvent(new Event('resize'))

const calculateStyle = R.pipe(
  R.ifElse(
    R.gt(1),
    zoom => ({
      transformOrigin: 'top left',
      transform: `scale(${zoom})`,
      height: `${100 / zoom}%`,
      width: `${100 / zoom}%`,
      left: 0,
    }),
    zoom => ({
      transformOrigin: 'top center',
      transform: 'scale(1)',
      height: '100%',
      width: `${100 / zoom}%`,
      left: `${50 - 50 / zoom}%`,
    }),
  ),
  R.mergeLeft({
    border: 'none',
    position: 'absolute',
    maxWidth: 'unset',
    margin: '0 auto',
    background: 'white',
  }),
)

class IFrame extends React.Component {
  // zoomable IFrame component
  constructor(props) {
    super(props)
    this.ref = el => el && (this.doc = el.contentDocument)
  }
  componentDidMount() {
    inheritStyles(document, this.doc)
    this.forceUpdate() // create portals after initial render
    resizeSignal()
  }
  render() {
    const { children, head, zoom = 1 } = this.props
    return (
      <Spring to={{ zoom }} onRest={resizeSignal}>
        {props => (
          <iframe ref={this.ref} style={calculateStyle(props.zoom)}>
            {this.doc && head && ReactDOM.createPortal(head, this.doc.head)}
            {this.doc && ReactDOM.createPortal(children, this.doc.body)}
          </iframe>
        )}
      </Spring>
    )
  }
}

export default IFrame
