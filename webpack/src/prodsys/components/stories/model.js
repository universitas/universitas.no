import { modelActions, modelSelectors } from 'ducks/basemodel'
export const MODEL = 'stories'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)

export const fields = {
  title: {
    name: 'title',
    label: 'tittel',
    type: 'string',
    editable: true,
  },
  lede: {
    name: 'lede',
    label: 'ingress',
    type: 'string',
    editable: true,
  },
  kicker: {
    name: 'kicker',
    label: 'stikktittel',
    type: 'string',
    editable: true,
  },
  working_title: {
    name: 'working_title',
    label: 'arbeidstittel',
    type: 'string',
    editable: true,
  },
  publication_status: {
    name: 'publication_status',
    label: 'status',
    type: 'select',
    editable: true,
    options: [
      {
        label: 'Prod',
        options: [
          { value: 3, label: 'Journalist' },
          { value: 4, label: 'Mellomleder' },
          { value: 5, label: 'Redaktør' },
        ],
      },
      {
        label: 'Desk',
        options: [
          { value: 6, label: 'Til Desken' },
          { value: 7, label: 'På Desken' },
        ],
      },
      {
        label: 'Nett',
        options: [
          { value: 9, label: 'Nettredaktør' },
          { value: 10, label: 'På nett' },
          { value: 11, label: 'På nett *' },
        ],
      },
      {
        label: 'Etc',
        options: [
          { value: 0, label: 'Skisse' },
          { value: 100, label: 'Mal' },
          { value: 15, label: 'Slettet' },
        ],
      },
    ],
  },
  story_type: {
    name: 'story_type',
    type: 'select',
    label: 'artikkeltype',
    editable: true,
    to: 'storytypes',
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
