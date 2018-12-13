import { connect } from 'react-redux'
import DetailPanel from 'components/DetailPanel'
import cx from 'classnames'
import { modelSelectors } from 'ducks/basemodel'
import {
  StoryTools,
  StoryDetailImages,
  StoryDetailText,
  StoryDetailPreview,
} from '.'
import { selectors, MODEL } from './model.js'
import { getRoutePayload } from 'prodsys/ducks/router'
import Debug from 'components/Debug'

const DetailPane = ({ pk, action, images, image_count }) => {
  if (action == 'change' || action == 'preview')
    return <StoryDetailText pk={pk} />
  if (action == 'images')
    return (
      <StoryDetailImages pk={pk} image_count={image_count} images={images} />
    )
  // if (action == 'preview') return <StoryDetailPreview pk={pk} />
  return <div>action??: {action}</div>
}

const StoryDetail = ({ pk, action, ...props }) => (
  <DetailPanel
    pk={pk}
    model={MODEL}
    getTitle={({ title, working_title }) => title || working_title}
    className={cx('StoryDetail', `status-${props.publication_status}`)}
  >
    <DetailPane pk={pk} action={action} {...props} />
  </DetailPanel>
)

const mapStateToProps = (state, { action, pk }) => selectors.getItem(pk)(state)

export default connect(mapStateToProps)(StoryDetail)
