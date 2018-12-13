import Pagination from 'components/Pagination'
import SearchField from 'components/SearchField'
import ReactDOM from 'react-dom'
import frontPageCss from '!css-loader!sass-loader!universitas/styles/universitas.scss'

const Filter = ({ label, isActive, title, onClick, disabled }) => (
  <button
    type="button"
    className={`Filter ${isActive ? 'active' : 'inactive'}`}
    onClick={onClick}
    title={title || label}
  >
    {label}
  </button>
)

const inheritStyles = (sourceDoc, targetDoc) => {
  for (const node of sourceDoc.head.children) {
    if (node.tagName == 'LINK' || node.tagName == 'STYLE')
      targetDoc.head.appendChild(node.cloneNode(true))
  }
}

class IFrame extends React.Component {
  constructor(props) {
    super(props)
    this.ref = el => el && (this.doc = el.contentDocument)
  }
  componentDidMount() {
    inheritStyles(document, this.doc)
    this.forceUpdate() // create portals after initial render
    window.dispatchEvent(new Event('resize'))
  }
  componentDidUpdate() {
    window.dispatchEvent(new Event('resize'))
  }
  render() {
    const { children, zoom = 100, ...props } = this.props
    const head = <style>{frontPageCss}</style>
    const style =
      zoom < 1
        ? {
            transformOrigin: 'top left',
            border: 'none',
            position: 'absolute',
            transform: `scale(${zoom})`,
            maxWidth: 'unset',
            height: `${100 / zoom}%`,
            width: `${100 / zoom}%`,
          }
        : {
            border: 'none',
            transformOrigin: 'center',
            position: 'absolute',
            transform: 'scale(1)',
            maxWidth: 'unset',
            height: '100%',
            width: `${100 / zoom}%`,
            left: `${50 - 50 / zoom}%`,
            margin: '0 auto',
          }
    return (
      <iframe ref={this.ref} style={style} {...props}>
        {this.doc && head && ReactDOM.createPortal(head, this.doc.head)}
        {this.doc && ReactDOM.createPortal(children, this.doc.body)}
      </iframe>
    )
  }
}

class PreviewPanel extends React.Component {
  state = { zoom: 1, inputZoom: null }

  constructor(props) {
    super(props)
    this.ref = node => {
      if (!node) return
      this.node = node
      this.setState({ inputZoom: this.node.clientWidth })
    }
    this.changeZoom = e => {
      const value = e.target.value
      const width = this.node.clientWidth
      const zoom = this.node ? this.node.clientWidth / value : 1
      this.setState({
        inputZoom: value,
        zoom: zoom,
      })
    }
  }

  render() {
    const { zoom, inputZoom } = this.state
    const style = {
      position: 'relative',
      overflow: 'hidden',
    }
    return (
      <section className="ListPanel">
        <div className="TopBar">
          <div className="Filters">
            <label>
              {inputZoom && (
                <input
                  type="range"
                  min="350"
                  max="2500"
                  step="50"
                  onChange={this.changeZoom}
                  value={inputZoom}
                />
              )}
              <span>{`${inputZoom} ${zoom}`}</span>
            </label>
          </div>
        </div>
        <section className="itemList" ref={this.ref} style={style}>
          <IFrame zoom={zoom}>
            <main className="PageSwitch">{this.props.children}</main>
          </IFrame>
        </section>
      </section>
    )
  }
}

export default PreviewPanel
