import React from 'react'
import ModelField from 'components/ModelField'

const fields = {
  caption: {
    type: 'shorttext',
    required: false,
    label: 'Bildetekst',
    help_text: 'Kort beskrivelse av bildet',
    rows: 4,
    editable: true,
  },
  creditline: {
    type: 'string',
    required: false,
    label: 'Bildetekst byline',
    editable: true,
  },
}

const mapFields = fields => fn =>
  R.pipe(
    R.mapObjIndexed((props, name, obj) => fn({ name, ...props })),
    R.values
  )(fields)

const StoryImageForm = ({ pk }) => (
  <form className="StoryImageForm">
    {mapFields(fields)(fp => (
      <ModelField {...fp} model="storyimages" pk={pk} key={fp.name} />
    ))}
  </form>
)

export default StoryImageForm
