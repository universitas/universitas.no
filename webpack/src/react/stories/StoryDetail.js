import { connect } from 'react-redux'
import cx from 'classnames'
import StoryTools from 'stories/StoryTools'
import { modelSelectors } from 'ducks/basemodel'
import StoryDetailImages from './StoryDetailImages'
import StoryDetailText from './StoryDetailText'

const model = 'stories'

const StoryDetail = ({
  pk,
  title,
  detail,
  publication_status,
  storytypechoices,
  images,
}) => (
  <section
    className={cx('DetailPanel', 'StoryDetail', `status-${publication_status}`)}
  >
    <StoryTools title={title} detail={detail} pk={pk} />
    {detail == 'text' && (
      <StoryDetailText {...{ pk, model, storytypechoices }} />
    )}
    {detail == 'images' && <StoryDetailImages {...{ pk, images }} />}
  </section>
)

const { getCurrentItemId, getCurrentItem } = modelSelectors(model)
const { getChoices } = modelSelectors('storytypes')
const getRouter = R.path(['router', 'params'])
const mapStateToProps = state => {
  const {
    id,
    title,
    working_title,
    publication_status,
    images,
  } = getCurrentItem(state)
  const { detail = 'text' } = getRouter(state)
  const storytypechoices = getChoices(state)
  return {
    title: title || working_title,
    images,
    detail,
    storytypechoices,
    pk: id,
    publication_status,
  }
}
export default connect(mapStateToProps)(StoryDetail)
