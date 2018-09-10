import { connect } from 'react-redux'
import cx from 'classnames'
import { modelSelectors } from 'ducks/basemodel'
import { StoryTools, StoryDetailImages, StoryDetailText } from '.'
import { selectors } from './model.js'
import { getRoutePayload } from 'prodsys/ducks/router'
import Debug from 'components/Debug'

const DetailPane = ({ pk, images, action }) => {
  if (action == 'change') return <StoryDetailText pk={pk} />
  if (action == 'images') return <StoryDetailImages pk={pk} images={images} />
  return <div>action??: {action}</div>
}

const StoryDetail = ({
  pk,
  action,
  title,
  working_title,
  publication_status,
  images,
  ...props
}) => (
  <section
    className={cx('DetailPanel', 'StoryDetail', `status-${publication_status}`)}
  >
    <StoryTools pk={pk} action={action} />
    <DetailPane pk={pk} images={images} action={action} />
  </section>
)

const mapStateToProps = (state, { action, pk }) => selectors.getItem(pk)(state)

export default connect(mapStateToProps)(StoryDetail)
