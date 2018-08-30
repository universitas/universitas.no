import { connect } from 'react-redux'
import cx from 'classnames'
import ModelField from 'components/ModelField'
import { PhotoStats } from 'components/photos'
import * as photo from 'components/photos/model.js'

class ImageData extends React.Component {
  componentDidMount() {
    const { fetch, id } = this.props
    if (!id) fetch()
  }
  render() {
    const { id, pk, ...props } = this.props
    if (!id) return null
    return (
      <div className={cx('ImageData')}>
        <ModelField
          editable={true}
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
