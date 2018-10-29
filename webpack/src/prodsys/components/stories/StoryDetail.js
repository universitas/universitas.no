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

const DetailPane = ({ pk, action, images }) => {
  if (action == 'change') return <StoryDetailText pk={pk} />
  if (action == 'images') return <StoryDetailImages pk={pk} images={images} />
  if (action == 'preview') return <StoryDetailPreview pk={pk} />
  return <div>action??: {action}</div>
}

const StoryDetail = ({ pk, action, publication_status, images = [] }) => (
  <DetailPanel
    pk={pk}
    model={MODEL}
    getTitle={({ title, working_title }) => title || working_title}
    className={cx('StoryDetail', `status-${publication_status}`)}
  >
    <DetailPane pk={pk} images={images} action={action} />
  </DetailPanel>
)

const mapStateToProps = (state, { action, pk }) => selectors.getItem(pk)(state)

export default connect(mapStateToProps)(StoryDetail)
