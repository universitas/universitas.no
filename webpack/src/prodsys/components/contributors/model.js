import { modelActions, modelSelectors } from 'ducks/basemodel'
export const MODEL = 'contributors'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)
import anonymous from 'images/anonymous.png'

const optionsFields = {
  id: {
    type: 'integer',
    required: false,
    read_only: true,
    label: 'ID',
  },
  url: {
    type: 'field',
    required: false,
    read_only: true,
    label: 'Url',
  },
  status: {
    type: 'choice',
    required: false,
    read_only: false,
    label: 'Status',
    choices: [
      { value: 0, display_name: 'Ukjent' },
      { value: 1, display_name: 'Aktiv' },
      { value: 2, display_name: 'Slutta' },
      { value: 3, display_name: 'Ekstern' },
    ],
  },
  display_name: {
    type: 'string',
    required: false,
    read_only: false,
    label: 'Navn',
    max_length: 50,
  },
  title: {
    type: 'string',
    read_only: true,
    label: 'Tittel',
  },
  phone: {
    type: 'phone',
    required: false,
    read_only: false,
    label: 'Telefon',
    max_length: 20,
  },
  email: {
    type: 'email',
    required: false,
    read_only: false,
    label: 'Epost',
    max_length: 254,
  },
  byline_photo: {
    type: 'select',
    filter: { category: 4 },
    required: false,
    read_only: false,
    label: 'Byline photo',
    to: 'photos',
  },
  thumb: {
    type: 'thumb',
    required: false,
    read_only: true,
    label: 'Bylinebilde',
    fallback: anonymous,
  },
  verified: {
    type: 'boolean',
    required: false,
    read_only: false,
    label: 'Verified',
    help_text: 'Kontrollert',
  },
  stint_set: {
    type: 'stints',
    required: false,
    read_only: true,
    label: 'Jobber',
    child: {
      type: 'nested object',
      required: false,
      read_only: true,
      children: {
        position: {
          type: 'field',
          required: false,
          read_only: true,
          label: 'Position',
        },
        start_date: {
          type: 'date',
          required: false,
          read_only: false,
          label: 'Start date',
        },
        end_date: {
          type: 'date',
          required: false,
          read_only: false,
          label: 'End date',
        },
      },
    },
  },
}

const cleanFields = R.pipe(
  R.mapObjIndexed((val, key) => R.assoc('name', key, val)),
  R.map(({ read_only, ...props }) => ({ ...props, editable: !read_only })),
  R.omit(['required', 'read_only', 'max_length']),
)

export const fields = cleanFields(optionsFields)