import { connect } from 'react-redux'
import { getUx } from 'ducks/ux'
import frontPageCss from '!css-loader!sass-loader!universitas/styles/universitas.scss'
import IFrame from './IFrame.js'
import './PreviewIframe.scss'

import Filter from 'components/ListPanel/Filter'

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
    const zoom =
      this.props.zoom && this.node ? this.node.clientWidth / this.props.zoom : 1
    return (
      <div className="PreviewIframe" ref={this.ref}>
        {this.state.ready && (
          <IFrame zoom={zoom} head={this.head}>
            <main className="PageSwitch">{this.props.children}</main>
          </IFrame>
        )}
      </div>
    )
  }
}
export default connect(getUx)(PreviewIframe)
