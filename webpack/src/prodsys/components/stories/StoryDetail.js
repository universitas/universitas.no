import { connect } from 'react-redux'
import cx from 'classnames'
import { modelSelectors } from 'ducks/basemodel'
import { StoryTools, StoryDetailImages, StoryDetailText } from '.'
import { selectors } from './model.js'

const StoryDetail = ({ pk, title, detail, publication_status, images }) => (
  <section
    className={cx('DetailPanel', 'StoryDetail', `status-${publication_status}`)}
  >
    <StoryTools title={title} detail={detail} pk={pk} />
    {detail == 'text' && <StoryDetailText key={pk} pk={pk} />}
    {detail == 'images' && (
      <StoryDetailImages key={pk} pk={pk} images={images} />
    )}
  </section>
)

const getRouter = R.path(['router', 'params'])

const mapStateToProps = state => {
  const {
    id,
    title,
    working_title,
    publication_status,
    images,
  } = selectors.getCurrentItem(state)
  const { detail = 'text' } = getRouter(state)
  return {
    title: title || working_title,
    images,
    detail,
    pk: id,
    publication_status,
  }
}
export default connect(mapStateToProps)(StoryDetail)
