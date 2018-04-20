import { connect } from 'react-redux'
import cx from 'classnames'
import { detailFields as fields } from 'stories/model'
import StoryTools from 'stories/StoryTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'

const model = 'stories'

const StoryDetail = ({ id: pk, publication_status, storytypechoices }) => (
  <section
    className={cx('DetailPanel', 'StoryDetail', `status-${publication_status}`)}
  >
    <StoryTools pk={pk} />
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
  </section>
)

const { getCurrentItemId, getCurrentItem } = modelSelectors(model)
const { getChoices } = modelSelectors('storytypes')
const mapStateToProps = state => ({
  storytypechoices: getChoices(state),
  //pk: getCurrentItemId(state),
  ...getCurrentItem(state),
})
export default connect(mapStateToProps)(StoryDetail)
