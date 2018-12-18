import { connect } from 'react-redux'
import { getUx } from 'ducks/ux'
import frontPageCss from '!css-loader!sass-loader!universitas/styles/universitas.scss'
import IFrame from './IFrame.js'
import './PreviewIframe.scss'

import Filter from 'components/ListPanel/Filter'

const DebugFrame = props => (
  // It's easier to do debugging with dev tools without the iframe
  <div
    style={{ background: 'white', flex: 1, overflowY: 'scroll' }}
    {...props}
  />
)

class PreviewIframe extends React.Component {
  constructor(props) {
    super(props)
    this.head = <style>{frontPageCss}</style>
    this.state = { ready: false }
    this.ref = node => {
      if (!node) return
      this.node = node
      this.setState({ ready: true })
    }
  }

  render() {
    const { debug = false, zoom, children } = this.props
    const zoomVal = zoom && this.node ? this.node.clientWidth / zoom : 1
    const content = <main className="PageSwitch">{children}</main>
    if (debug) return <DebugFrame children={content} />
    return (
      <div className="PreviewIframe" ref={this.ref}>
        {this.state.ready && (
          <IFrame zoom={zoomVal} head={this.head} children={content} />
        )}
      </div>
    )
  }
}
export default connect(getUx)(PreviewIframe)
