import { cleanFields } from 'utils/modelUtils'

export const fields = [
  {
    key: 'display_name',
    label: 'navn',
    type: 'string',
    editable: true,
  },
  {
    key: 'thumb',
    label: 'bilde',
    type: 'thumb',
  },
  {
    key: 'status',
    label: 'status',
    type: 'choice',
    choices: [
      { value: '0', display_name: 'Ukjent' },
      { value: '1', display_name: 'Aktiv' },
      { value: '2', display_name: 'Slutta' },
      { value: '3', display_name: 'Ekstern' },
    ],
    editable: true,
  },
].map(cleanFields)
