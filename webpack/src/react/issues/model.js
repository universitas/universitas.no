import { cleanFields } from 'utils/modelUtils'

export const fields = [
  {
    key: 'year',
    label: 'år',
    type: 'integer',
  },
  {
    key: 'number',
    label: 'utgave',
    type: 'integer',
  },
  {
    key: 'issue_type',
    label: 'utgavetype',
    type: 'choice',
    choices: [
      { value: 1, display_name: 'Vanlig' },
      { value: 2, display_name: 'Magasin' },
      { value: 3, display_name: 'Velkomstutgave' },
    ],
    editable: true,
  },
  {
    key: 'publication_date',
    label: 'dato',
    type: 'date',
    editable: true,
  },
].map(cleanFields)
