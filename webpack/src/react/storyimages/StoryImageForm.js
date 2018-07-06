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
  ordering: { type: 'integer', label: 'rekkefølge', editable: true },
  placement: { type: 'string', label: 'plassering', editable: true },
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
  aspect_ratio: {
    type: 'choice',
    required: true,
    label: 'bildeformat',
    help_text: 'høyde / bredde',
    editable: true,
    choices: [
      { value: '0.0', display_name: 'auto' },
      { value: 0.4, display_name: '5:2 bredde' },
      { value: 0.5, display_name: '2:1 bredde' },
      { value: 0.5625, display_name: '16:9 bredde (youtube)' },
      { value: 0.6667, display_name: '3:2 bredde' },
      { value: 0.75, display_name: '4:3 bredde' },
      { value: 1.0, display_name: '1:1 kvadrat' },
      { value: 1.3333, display_name: '3:4 høyde' },
      { value: 1.5, display_name: '2:3 høyde' },
      { value: 2.0, display_name: '1:2 høyde' },
    ],
  },
  creditline: {
    type: 'string',
    required: false,
    label: 'fotokred',
    editable: true,
  },
}

const mapFields = fields => fn =>
  R.pipe(
    R.mapObjIndexed((props, name, obj) => fn({ name, ...props })),
    R.values,
  )(fields)

const StoryImageForm = ({ pk }) => (
  <form className="StoryImageForm">
    {mapFields(fields)(fp => (
      <ModelField {...fp} model="storyimages" pk={pk} key={fp.name} />
    ))}
  </form>
)

export default StoryImageForm

const as = {}
