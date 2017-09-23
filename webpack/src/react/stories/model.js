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

const fieldListToMapping = fieldList => {
  const fields = {}
  for (const f of fieldList) {
    const { key, ...props } = f
    fields[key] = { name: key, ...props }
  }
  return fields
}

export const fields = modelFields.map(cleanFields)
// export const listFields = fieldListToMapping(listFieldFilter(fields))
// export const detailFields = fieldListToMapping(detailFieldFilter(fields))

export const listFields = {
  working_title: {
    name: 'working_title',
    label: 'arbeidstittel',
    type: 'string',
  },
  publication_status: {
    name: 'publication_status',
    label: 'status',
    type: 'choice',
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
  story_type_name: {
    name: 'story_type_name',
    label: 'artikkeltype',
    type: 'string',
  },
  modified: {
    name: 'modified',
    label: 'endret',
    type: 'datetime',
    relative: true,
  },
}

export const detailFields = {
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
  bodytext_markup: {
    name: 'bodytext_markup',
    label: 'tekst',
    type: 'text',
    editable: true,
  },
}
