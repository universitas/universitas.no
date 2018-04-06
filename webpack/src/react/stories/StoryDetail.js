import { connect } from 'react-redux'
import { detailFields as fields } from 'stories/model'
import StoryTools from 'stories/StoryTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'

const model = 'stories'

const StoryDetail = ({ pk, storytypechoices }) => (
  <section className="DetailPanel">
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

const { getCurrentItemId: pk } = modelSelectors(model)
const { getChoices: storytypechoices } = modelSelectors('storytypes')
export default connect(R.applySpec({ pk, storytypechoices }))(StoryDetail)
