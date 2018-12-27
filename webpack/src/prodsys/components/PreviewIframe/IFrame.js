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

const percent = n => `${n.toPrecision(4)}%`

const calculateStyle = R.ifElse(
  R.gt(1),
  zoom => ({
    transform: `scale(${zoom.toPrecision(4)})`,
    height: percent(100 / zoom),
    width: percent(100 / zoom),
    left: 0,
  }),
  zoom => ({
    transform: 'scale(1)',
    height: '100%',
    width: percent(100 / zoom),
    left: percent(50 - 50 / zoom),
  }),
)

class IFrame extends React.Component {
  // zoomable IFrame component
  constructor(props) {
    super(props)
    this.doc = null
    this.refHandler = el => {
      if (!el) return
      this.node = el
      el.addEventListener('load', this.onLoadHandler)
      // fallback (maybe for some browser if onload doesn't fire?)
      setTimeout(this.onLoadHandler, 1000)
    }
    this.onLoadHandler = e => {
      if (this.doc) return
      this.doc = this.node.contentDocument
      setTimeout(() => {
        // create portals after initial render
        inheritStyles(document, this.doc)
        this.forceUpdate()
        resizeSignal()
      }, 100)
      this.node.removeEventListener('load', this.onLoadHandler)
    }
  }
  render() {
    const { children, head, zoom = 1 } = this.props
    return (
      <Spring to={{ zoom }} onRest={resizeSignal}>
        {props => (
          <iframe
            srcDoc={'<!DOCTYPE html><html></html>'}
            className="IFrame"
            style={calculateStyle(props.zoom)}
            ref={this.refHandler}
          >
            {this.doc &&
              ReactDOM.createPortal(head, this.doc.head) &&
              ReactDOM.createPortal(children, this.doc.body)}
          </iframe>
        )}
      </Spring>
    )
  }
}

export default IFrame
