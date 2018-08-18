import { modelActions, modelSelectors } from 'ducks/basemodel'
export const MODEL = 'issues'
export const actions = modelActions(MODEL)
export const selectors = modelSelectors(MODEL)

const cleanFields = R.pipe(
  R.mapObjIndexed((val, key) => R.assoc('name', key, val)),
  R.map(({ read_only, ...props }) => ({ ...props, editable: !read_only })),
  R.omit(['required', 'read_only', 'max_length']),
)

const optionsFields = {
  id: {
    type: 'integer',
    required: false,
    read_only: true,
    label: 'ID',
  },
  url: {
    type: 'link',
    required: false,
    read_only: true,
    label: 'Url',
  },
  publication_date: {
    type: 'date',
    required: false,
    read_only: false,
    label: 'Dato',
  },
  year: {
    type: 'integer',
    required: false,
    read_only: true,
    label: 'År',
  },
  issue_name: {
    type: 'string',
    required: false,
    read_only: true,
    label: 'Navn',
  },
  pdfs: {
    type: 'pdfs',
    required: false,
    read_only: true,
    label: 'Pdf',
    child: {
      type: 'nested object',
      required: false,
      read_only: true,
      children: {
        url: {
          type: 'field',
          required: false,
          read_only: true,
          label: 'Url',
        },
        pages: {
          type: 'integer',
          required: false,
          read_only: true,
          label: 'Sider',
          help_text: 'Number of pages',
        },
        cover_page: {
          type: 'image upload',
          required: false,
          read_only: false,
          label: 'Omslag',
          help_text: 'Bildefil av forsiden',
          max_length: 100,
        },
        pdf: {
          type: 'file upload',
          required: true,
          read_only: false,
          label: 'Pdf',
          help_text: 'Pdf-fil for denne papirutgaven',
          max_length: 100,
        },
      },
    },
  },
  issue_type: {
    type: 'choice',
    required: false,
    read_only: false,
    label: 'Type',
    choices: [
      { value: 1, display_name: 'Vanlig' },
      { value: 2, display_name: 'Magasin' },
      { value: 3, display_name: 'Velkomstutgave' },
    ],
  },
}

export const fields = cleanFields(optionsFields)
