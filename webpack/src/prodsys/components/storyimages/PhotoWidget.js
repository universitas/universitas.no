import { connect } from 'react-redux'
import cx from 'classnames'
import ModelField from 'components/ModelField'
import { PhotoStats } from 'components/photos'
import * as photo from 'components/photos/model.js'

class PhotoWidget extends React.Component {
  render() {
    const { id, pk, ...props } = this.props
    return (
      <div className={cx('PhotoWidget')}>
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

export default connect((state, { pk }) => photo.selectors.getItem(pk)(state))(
  PhotoWidget,
)
