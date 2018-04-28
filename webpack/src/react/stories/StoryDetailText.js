import React from 'react'
import cx from 'classnames'
import { detailFields as fields } from 'stories/model'
import ModelField from 'components/ModelField'

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

export default TextDetail
