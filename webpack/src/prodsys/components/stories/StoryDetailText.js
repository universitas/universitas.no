import cx from 'classnames'
import ModelField from 'components/ModelField'
import { fields, MODEL } from './model.js'

const TextDetail = ({ pk, storytypechoices }) => {
  const props = { pk, model: MODEL }
  return (
    <div className="panelContent">
      <ModelField {...{ ...props, ...fields.working_title }} />
      <ModelField {...{ ...props, ...fields.publication_status }} />
      <ModelField
        {...{
          ...props,
          ...fields.story_type,
          choices: storytypechoices,
          type: 'choice',
        }}
      />
      <ModelField {...{ ...props, ...fields.created }} />
      <ModelField {...{ ...props, ...fields.modified }} />
      <ModelField {...{ ...props, ...fields.bodytext_markup }} />
    </div>
  )
}

export default TextDetail
