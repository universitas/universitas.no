import { modelActions, modelSelectors } from 'ducks/basemodel'
import { fieldFactory } from 'components/ModelField'

export const MODEL = 'frontpage'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)

export const fields = {
  id: { label: 'ID', type: 'integer' },
  image_id: { label: 'foto', type: 'select', to: 'photos', required: false },
  crop_box: { label: 'beskjæring', type: 'cropbox' },
  section: { label: 'seksjon', type: 'integer' },
  language: { label: 'språk', type: 'field' },
  story: { label: 'artikkel', type: 'select', to: 'stories' },
  headline: {
    label: 'tittel',
    type: 'shorttext',
    helpText: 'tittel / overskrift',
    maxLength: 200,
  },
  kicker: {
    label: 'stikktittel',
    type: 'string',
    helpText: 'stikktittel',
    maxLength: 200,
  },
  vignette: {
    label: 'vignett',
    type: 'string',
    helpText: 'vignett',
    maxLength: 50,
  },
  lede: {
    label: 'ingress',
    type: 'shorttext',
    helpText: 'ingress',
    maxLength: 200,
  },
  html_class: {
    type: 'string',
    label: 'Html class',
    helpText: 'html class',
    maxLength: 200,
  },
  priority: { label: 'prioritet', type: 'range', step: 0.1, min: -20, max: 20 },
  size: { label: 'størrelse', type: 'size' },
  published: { label: 'publisert', type: 'boolean', helpText: 'published' },
}

export const Field = fieldFactory(MODEL, fields)
