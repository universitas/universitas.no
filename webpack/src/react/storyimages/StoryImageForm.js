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
  size: {
    type: 'choice',
    required: true,
    label: 'prioritet',
    editable: true,
    choices: [
      { value: '5', display_name: '5 (høyest)' },
      { value: '4', display_name: '4' },
      { value: '3', display_name: '3' },
      { value: '2', display_name: '2' },
      { value: '1', display_name: '1 (lavest)' },
      { value: '0', display_name: '0 (skal ikke brukes)' },
    ],
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
