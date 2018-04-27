import { connect } from 'react-redux'
import cx from 'classnames'
import { detailFields as fields } from 'stories/model'
import StoryTools from 'stories/StoryTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'

const model = 'stories'

const StoryDetail = ({
  pk,
  title,
  detail,
  publication_status,
  storytypechoices,
}) => (
  <section
    className={cx('DetailPanel', 'StoryDetail', `status-${publication_status}`)}
  >
    <StoryTools title={title} detail={detail} pk={pk} />
    {detail == 'text' && <TextDetail {...{ pk, model, storytypechoices }} />}
    {detail == 'images' && <StoryImagesDetail {...{ pk, model }} />}
  </section>
)

const StoryImagesDetail = ({ pk }) => <div className="panelContent">{pk}</div>

const TextDetail = ({ pk, model, storytypechoices }) => (
  <div className="panelContent">
    <ModelField {...{ pk, model, ...fields.working_title }} />
    <ModelField {...{ pk, model, ...fields.publication_status }} />
    <ModelField
      {...{
        pk,
        model,
        ...fields.story_type,
        choices: storytypechoices,
        type: 'choice',
      }}
    />
    <ModelField {...{ pk, model, ...fields.created }} />
    <ModelField {...{ pk, model, ...fields.modified }} />
    <ModelField {...{ pk, model, ...fields.bodytext_markup }} />
  </div>
)

const { getCurrentItemId, getCurrentItem } = modelSelectors(model)
const { getChoices } = modelSelectors('storytypes')
const getRouter = R.path(['router', 'params'])
const mapStateToProps = state => {
  const { id, title, working_title, publication_status } = getCurrentItem(state)
  const { detail = 'text' } = getRouter(state)
  const storytypechoices = getChoices(state)
  return {
    title: title || working_title,
    detail,
    storytypechoices,
    pk: id,
    publication_status,
  }
}
export default connect(mapStateToProps)(StoryDetail)
