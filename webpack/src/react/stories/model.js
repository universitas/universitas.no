import {
  cleanFields,
  listFieldFilter,
  detailFieldFilter,
} from 'utils/modelUtils'

const modelFields = [
  {
    key: 'working_title',
    label: 'arbeidstittel',
    type: 'string',
    editable: true,
  },
  {
    key: 'publication_status',
    label: 'status',
    type: 'choice',
    editable: true,
    choices: [
      { value: '0', display_name: 'Skisse' },
      { value: '3', display_name: 'Journalist' },
      { value: '4', display_name: 'Mellomleder' },
      { value: '5', display_name: 'Redaktør' },
      { value: '6', display_name: 'Til Desken' },
      { value: '7', display_name: 'På Desken' },
      { value: '9', display_name: 'Nettredaktør' },
      { value: '10', display_name: 'På nett' },
      { value: '11', display_name: 'På nett *' },
      { value: '15', display_name: 'Slettet' },
      { value: '100', display_name: 'Mal' },
    ],
  },
  {
    key: 'story_type',
    label: 'artikkeltype',
    type: 'storytype',
    editable: true,
    list: false,
  },
  {
    key: 'story_type_name',
    label: 'artikkeltype',
    type: 'string',
    detail: false,
  },
  {
    key: 'created',
    label: 'opprettet',
    type: 'datetime',
    list: false,
  },
  {
    key: 'modified',
    label: 'endret',
    type: 'datetime',
  },
  {
    key: 'bodytext_markup',
    label: 'tekst',
    list: false,
    editable: true,
    type: 'text',
  },
]

export const fields = modelFields.map(cleanFields)
export const listFields = listFieldFilter(fields)
export const detailFields = detailFieldFilter(fields)
