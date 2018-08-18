import { modelActions, modelSelectors } from 'ducks/basemodel'
export const MODEL = 'stories'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)

export const fields = {
  working_title: {
    name: 'working_title',
    label: 'arbeidstittel',
    type: 'string',
    editable: true,
  },
  publication_status: {
    name: 'publication_status',
    label: 'status',
    type: 'choice',
    editable: true,
    choices: [
      { value: 0, display_name: 'Skisse' },
      { value: 3, display_name: 'Journalist' },
      { value: 4, display_name: 'Mellomleder' },
      { value: 5, display_name: 'Redaktør' },
      { value: 6, display_name: 'Til Desken' },
      { value: 7, display_name: 'På Desken' },
      { value: 9, display_name: 'Nettredaktør' },
      { value: 10, display_name: 'På nett' },
      { value: 11, display_name: 'På nett *' },
      { value: 15, display_name: 'Slettet' },
      { value: 100, display_name: 'Mal' },
    ],
  },
  story_type: {
    name: 'story_type',
    label: 'artikkeltype',
    type: 'storytype',
    editable: true,
  },
  created: {
    name: 'created',
    label: 'opprettet',
    type: 'datetime',
    editable: false,
  },
  modified: {
    name: 'modified',
    label: 'endret',
    type: 'datetime',
    editable: false,
  },
  story_type_name: {
    name: 'story_type_name',
    label: 'artikkeltype',
    type: 'string',
  },
  bodytext_markup: {
    name: 'bodytext_markup',
    label: 'tekst',
    type: 'text',
    editable: true,
  },
  byline_set: {
    name: 'byline_set',
    label: 'bylines',
    type: 'count',
    editable: false,
  },
  images: {
    name: 'images',
    label: 'foto',
    type: 'count',
    editable: false,
  },
}
