import { modelActions, modelSelectors } from 'ducks/basemodel'
import { fieldFactory } from 'components/ModelField'

export const MODEL = 'issues'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)

export const fields = {
  id: { type: 'integer', label: 'ID' },
  url: { type: 'link', label: 'Url' },
  year: { type: 'integer', label: 'År' },
  issue_name: { type: 'string', label: 'Navn' },
  publication_date: { type: 'date', label: 'Dato' },
  issue_type: {
    type: 'select',
    label: 'Type',
    options: [
      { value: 1, label: 'Vanlig' },
      { value: 2, label: 'Magasin' },
      { value: 3, label: 'Velkomstutgave' },
    ],
  },
  pdfs: {
    type: 'pdfs',
    label: 'Pdf',
    child: {
      type: 'nested object',
      children: {
        url: { type: 'field', label: 'Url' },
        pages: {
          type: 'integer',
          label: 'Sider',
          help_text: 'Number of pages',
        },
        cover: {
          type: 'image upload',
          label: 'Omslag',
          help_text: 'Bildefil av forsiden',
          max_length: 100,
        },
        pdf: {
          type: 'file upload',
          label: 'Pdf',
          help_text: 'Pdf-fil for denne papirutgaven',
          max_length: 100,
        },
      },
    },
  },
}

export const Field = fieldFactory(MODEL, fields)
