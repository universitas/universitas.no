import cx from 'classnames'
import ModelField from 'components/ModelField'
import { fields, MODEL } from './model.js'

const TextDetail = ({ pk, storytypechoices }) => {
  const Field = ({ name, ...props }) => (
    <ModelField
      pk={pk}
      key={name}
      model={MODEL}
      {...{ ...fields[name], ...props }}
    />
  )
  return (
    <div className="panelContent">
      <div className="wrapForm">
        <Field name="working_title" />
        <Field name="story_type" type="choice" choices={storytypechoices} />
        <Field name="publication_status" />
        <Field name="created" />
        <Field name="modified" />
      </div>
      <Field name="bodytext_markup" />
    </div>
  )
}

export default TextDetail
