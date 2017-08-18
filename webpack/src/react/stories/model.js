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
    key: 'created',
    type: 'datetime',
    list: false,
  },
  {
    key: 'modified',
    type: 'datetime',
  },
  {
    key: 'public_url',
    label: 'lenke',
    type: 'link',
    list: false,
  },
  {
    key: 'edit_url',
    label: 'django',
    type: 'link',
    list: false,
  },
  {
    key: 'publication_status',
    label: 'status',
    type: 'choice',
    editable: true,
    choices: [
      { value: '0', display_name: 'Skisse' },
      { value: '3', display_name: 'Til Journalist' },
      { value: '4', display_name: 'Til Mellomleder' },
      { value: '5', display_name: 'Til Redaktør' },
      { value: '6', display_name: 'Til Desken' },
      { value: '9', display_name: 'Klar for nett' },
      { value: '10', display_name: 'Publisert på nett' },
      { value: '11', display_name: 'Publisert, men skjult for søkemotorer' },
      { value: '15', display_name: 'Skal ikke publiseres' },
      { value: '100', display_name: 'Brukt som mal for nye artikler' },
      { value: '500', display_name: 'Teknisk feil (sjekk bylines)' },
    ],
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
