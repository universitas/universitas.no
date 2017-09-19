import { connect } from 'react-redux'
import { detailFields } from 'stories/model'
import StoryTools from 'stories/StoryTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'

const model = 'stories'
const { getCurrentItemId } = modelSelectors(model)
const { getItems: getStoryTypes } = modelSelectors('storytypes')

const fields = {}
for (const f of detailFields) {
  const { key, ...props } = f
  fields[key] = { name: key, ...props }
}

const Field = ({ label, type, ...props }) => (
  <div className={`DetailField ${type}`}>
    <span className="label">{label}: </span>
    <ModelField className="Field" type={type} {...props} />
  </div>
)

const getChoices = R.pipe(
  R.values,
  R.map(({ id, name }) => ({
    value: R.toString(id),
    display_name: name,
  }))
)

const Detail = ({ pk, storytypechoices }) => {
  const props = { pk, model }
  return (
    <div className="wrapper">
      <StoryTools pk={pk} />
      <div className="fields">
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
    </div>
  )
}

export default connect(state => ({
  storytypechoices: getChoices(getStoryTypes(state)),
  pk: getCurrentItemId(state),
}))(Detail)
