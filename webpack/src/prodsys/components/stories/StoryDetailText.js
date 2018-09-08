import cx from 'classnames'
import { Field, MODEL } from './model.js'

const StoryDetailText = ({ pk, storytypechoices }) => {
  return (
    <div className="panelContent">
      <div className="wrapForm">
        <Field pk={pk} name="working_title" editable />
        <Field pk={pk} name="story_type" editable />
        <Field pk={pk} name="publication_status" editable />
        <Field pk={pk} name="created" />
        <Field pk={pk} name="modified" />
      </div>
      <Field pk={pk} name="bodytext_markup" editable />
    </div>
  )
}

export default StoryDetailText
