import { modelActions, modelSelectors } from 'ducks/basemodel'
import { fieldFactory } from 'components/ModelField'

export const MODEL = 'contributors'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)

export const fields = {
  id: { type: 'integer', label: 'ID' },
  url: { type: 'field', label: 'Url' },
  display_name: { type: 'string', label: 'Navn' },
  username: { type: 'string', label: 'Brukernavn', editable: false },
  title: { type: 'string', label: 'Tittel' },
  phone: { type: 'phone', label: 'Telefon' },
  email: { type: 'email', label: 'Epost' },
  thumb: {
    type: 'thumb',
    label: 'Bylinebilde',
    fallback: require('images/anonymous.png'),
  },
  status: {
    type: 'select',
    label: 'Status',
    options: [
      { value: 0, label: 'Ukjent' },
      { value: 1, label: 'Aktiv' },
      { value: 2, label: 'Slutta' },
      { value: 3, label: 'Ekstern' },
    ],
  },
  first_position: {
    type: 'select',
    // filter: { is_active: true },
    label: 'Posisjon',
    to: 'positions',
    required: false,
  },
  byline_photo: {
    type: 'select',
    filter: { category: 4 },
    label: 'Bylinebilde',
    to: 'photos',
    required: false,
  },
  stint_set: {
    type: 'stints',
    label: 'Jobber',
    child: {
      type: 'nested object',
      children: {
        position: { type: 'field', label: 'Position' },
        start_date: { type: 'date', label: 'Start date' },
        end_date: { type: 'date', label: 'End date' },
      },
    },
  },
}
export const Field = fieldFactory(MODEL, fields)
