import { modelActions, modelSelectors } from 'ducks/basemodel'
export const MODEL = 'frontpage'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)

export const fields = {
  id: {
    label: 'ID',
    type: 'integer',
    required: false,
    editable: false,
  },
  headline: {
    label: 'tittel',
    type: 'shorttext',
    required: false,
    editable: true,
    helpText: 'tittel / overskrift',
    maxLength: 200,
  },
  kicker: {
    label: 'stikktittel',
    type: 'string',
    required: false,
    editable: true,
    helpText: 'stikktittel',
    maxLength: 200,
  },
  vignette: {
    label: 'vignett',
    type: 'string',
    required: false,
    editable: true,
    helpText: 'vignett',
    maxLength: 50,
  },
  lede: {
    label: 'ingress',
    type: 'shorttext',
    required: false,
    editable: true,
    helpText: 'ingress',
    maxLength: 200,
  },
  html_class: {
    type: 'string',
    required: false,
    editable: true,
    label: 'Html class',
    helpText: 'html class',
    maxLength: 200,
  },
  priority: {
    label: 'prioritet',
    type: 'range',
    step: 0.1,
    min: -20,
    max: 20,
    editable: true,
  },
  size: {
    label: 'størrelse',
    type: 'size',
    required: true,
    editable: true,
  },
  published: {
    label: 'publisert',
    type: 'boolean',
    required: false,
    editable: true,
    helpText: 'published',
  },
  image_id: {
    label: 'foto',
    type: 'select',
    to: 'photos',
    required: false,
    editable: true,
  },
  crop_box: {
    label: 'beskjæring',
    type: 'cropbox',
    required: false,
    editable: false,
  },
  section: {
    label: 'seksjon',
    type: 'integer',
    required: false,
    editable: false,
  },
  language: {
    label: 'språk',
    type: 'field',
    required: false,
    editable: false,
  },
  story: {
    label: 'artikkel',
    type: 'select',
    to: 'stories',
    editable: false,
  },
}
