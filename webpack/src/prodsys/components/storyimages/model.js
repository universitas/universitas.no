import { modelActions, modelSelectors } from 'ducks/basemodel'
import { fieldFactory } from 'components/ModelField'

export const MODEL = 'storyimages'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)

export const fields = {
  caption: {
    type: 'shorttext',
    label: 'Bildetekst',
    help_text: 'Kort beskrivelse av bildet',
  },
  ordering: { type: 'integer', label: 'rekkefølge' },
  placement: { type: 'string', label: 'plassering' },
  creditline: { type: 'string', label: 'fotokred' },
  size: {
    type: 'select',
    label: 'prioritet',
    options: [
      { value: '5', label: '5 (høyest)' },
      { value: '4', label: '4' },
      { value: '3', label: '3' },
      { value: '2', label: '2' },
      { value: '1', label: '1 (lavest)' },
      { value: '0', label: '0 (skal ikke brukes)' },
    ],
  },
  aspect_ratio: {
    type: 'select',
    label: 'bildeformat',
    help_text: 'høyde / bredde',
    options: [
      { value: '0.0', label: 'auto' },
      { value: '0.4', label: '5:2 bredde' },
      { value: '0.5', label: '2:1 bredde' },
      { value: '0.5625', label: '16:9 bredde (youtube)' },
      { value: '0.6667', label: '3:2 bredde' },
      { value: '0.75', label: '4:3 bredde' },
      { value: '1.0', label: '1:1 kvadrat' },
      { value: '1.3333', label: '3:4 høyde' },
      { value: '1.5', label: '2:3 høyde' },
      { value: '2.0', label: '1:2 høyde' },
    ],
  },
}

export const Field = fieldFactory(MODEL, fields)
