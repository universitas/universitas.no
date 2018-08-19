import { connect } from 'react-redux'
import cx from 'classnames'
import ModelField from 'components/ModelField'
import { PhotoStats } from 'components/photos'
import * as photo from 'components/photos/model.js'

class ImageData extends React.Component {
  constructor(props) {
    super(props)
    this.state = { editable: false }
    this.onHover = () => this.setState({ editable: true })
    this.onLeave = () => this.setState({ editable: false })
  }

  componentDidMount() {
    const { fetch, id } = this.props
    if (!id) fetch()
  }

  render() {
    const { id, pk, ...props } = this.props
    const { editable } = this.state
    if (!id) return null
    return (
      <div
        onMouseEnter={this.onHover}
        onMouseLeave={this.onLeave}
        className={cx('ImageData')}
      >
        <ModelField
          editable={editable}
          type="cropbox"
          name="crop_box"
          model="photos"
          pk={pk}
        />
        <PhotoStats {...props} />
      </div>
    )
  }
}

export default connect(
  (state, { pk }) => photo.selectors.getItem(pk)(state),
  (dispatch, { pk }) => ({
    fetch: () => dispatch(photo.actions.itemRequested(pk)),
  }),
)(ImageData)
