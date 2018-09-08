import { modelActions, modelSelectors } from 'ducks/basemodel'
import { fieldFactory } from 'components/ModelField'

export const MODEL = 'photos'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)

export const fields = {
  id: { type: 'integer', label: 'ID' },
  url: { type: 'url', label: 'Url' },
  filename: { type: 'string', label: 'Filnavn' },
  filesize: { type: 'filesize', label: 'Filstørrelse' },
  contributor: { type: 'select', label: 'Byline', to: 'contributors' },
  artist: { type: 'string', label: 'Fotokred' },
  created: { type: 'datetime', label: 'Dato' },
  mimetype: { type: 'string', label: 'Mime-type' },
  category: {
    type: 'select',
    label: 'Kategori',
    help_text: 'kategori',
    options: [
      { value: 1, label: 'foto' },
      { value: 2, label: 'illustrasjon' },
      { value: 3, label: 'diagram' },
      { value: 4, label: 'bylinebilde' },
      { value: 5, label: 'ekstern' },
    ],
  },
  cropping_method: {
    type: 'select',
    label: 'Beskjæringsmetode',
    help_text: 'Metode for beskjæring',
    options: [
      { value: 0, label: 'midtpunkt' },
      { value: 1, label: 'i kø' },
      { value: 5, label: 'detaljer' },
      { value: 10, label: 'ansikter' },
      { value: 15, label: 'portrett' },
      { value: 100, label: 'manuell beskjæring' },
    ],
  },
  method: { type: 'string', label: 'Method' },
  width: { type: 'number', label: 'Bredde' },
  height: { type: 'number', label: 'Høyde' },
  original: { type: 'link', label: 'Original' },
  thumb: { type: 'thumb', label: 'Thumb' },
  small: { type: 'thumb', label: 'Liten' },
  large: { type: 'image', label: 'Bilde' },
  description: {
    type: 'shorttext',
    label: 'Beskrivelse',
    help_text: 'Kort beskrivelse av bildet',
  },
  usage: { type: 'integer', label: 'Artikler' },
  _imagehash: {
    type: 'string',
    label: 'Bilde-hash',
    help_text: 'unik bildekode ved dhash-algoritmen',
  },
  crop_box: { type: 'cropbox', label: 'Beskjæring' },
}

export const Field = fieldFactory(MODEL, fields)
