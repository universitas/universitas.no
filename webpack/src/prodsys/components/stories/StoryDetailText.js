import cx from 'classnames'
import { Field, MODEL } from './model.js'

const WebFields = ({ pk }) => (
  <div className="wrapForm">
    <Field pk={pk} name="kicker" editable />
    <Field pk={pk} name="theme_word" editable />
    <Field pk={pk} name="title" fullwidth editable />
    <Field pk={pk} name="lede" fullwidth editable />
  </div>
)
const ProdFields = ({ pk }) => (
  <div className="wrapForm">
    <Field pk={pk} name="working_title" fullwidth editable />
    <Field pk={pk} name="story_type" editable />
    <Field pk={pk} name="publication_status" editable />
    <Field pk={pk} name="created" />
    <Field pk={pk} name="modified" />
  </div>
)

const StoryDetailText = ({ pk }) => (
  <>
    <ProdFields pk={pk} />
    <Field pk={pk} name="bodytext_markup" editable />
  </>
)

export default StoryDetailText
