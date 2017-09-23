import { connect } from 'react-redux'
import { detailFields as fields } from 'stories/model'
import StoryTools from 'stories/StoryTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'

const model = 'stories'

const Field = ({ label, type, ...props }) => (
  <div className={`DetailField ${type}`}>
    <span className="label">{label}: </span>
    <ModelField className="Field" type={type} {...props} />
  </div>
)

const StoryDetail = ({ pk, storytypechoices }) => (
  <section className="DetailPanel">
    <StoryTools pk={pk} />
    <div className="panelContent">
      <Field {...{ pk, model, ...fields.working_title }} />
      <Field {...{ pk, model, ...fields.publication_status }} />
      <Field
        {...{
          pk,
          model,
          ...fields.story_type,
          choices: storytypechoices,
          type: 'choice',
        }}
      />
      <Field {...{ pk, model, ...fields.created }} />
      <Field {...{ pk, model, ...fields.modified }} />
      <Field {...{ pk, model, ...fields.bodytext_markup }} />
    </div>
  </section>
)

const { getCurrentItemId: pk } = modelSelectors(model)
const { getChoices: storytypechoices } = modelSelectors('storytypes')
export default connect(R.applySpec({ pk, storytypechoices }))(StoryDetail)
