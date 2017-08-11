import {
  cleanFields,
  listFieldFilter,
  detailFieldFilter,
} from 'utils/modelUtils'

const modelFields = [
  {
    key: 'name',
    label: 'filnavn',
    type: 'string',
  },
  {
    key: 'large',
    label: 'bilde',
    list: false,
    type: 'thumb',
  },
  {
    key: 'small',
    label: 'bilde',
    detail: false,
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
]

export const fields = modelFields.map(cleanFields)
export const listFields = listFieldFilter(fields)
export const detailFields = detailFieldFilter(fields)
