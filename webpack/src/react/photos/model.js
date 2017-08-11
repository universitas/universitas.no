import { cleanFields } from 'utils/modelUtils'

export const fields = [
  {
    key: 'name',
    label: 'filnavn',
    type: 'string',
  },
  {
    key: 'large',
    label: 'bilde',
    type: 'thumb',
  },
  {
    key: 'created',
    label: 'dato',
    type: 'date',
  },
  {
    key: 'usage',
    label: 'brukt #',
    type: 'integer',
  },
].map(cleanFields)
