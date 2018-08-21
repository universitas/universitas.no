import cx from 'classnames'
import ModelField from 'components/ModelField'
import { fields, MODEL } from './model.js'

const Field = props => (
  <ModelField model={MODEL} {...fields[props.name]} {...props} />
)

const StoryDetailText = ({ pk, storytypechoices }) => {
  return (
    <div className="panelContent">
      <div className="wrapForm">
        <Field pk={pk} name="working_title" />
        <Field
          pk={pk}
          name="story_type"
          type="choice"
          choices={storytypechoices}
        />
        <Field pk={pk} name="publication_status" />
        <Field pk={pk} name="created" />
        <Field pk={pk} name="modified" />
      </div>
      <Field pk={pk} name="bodytext_markup" />
    </div>
  )
}

export default StoryDetailText
