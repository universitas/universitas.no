const cleanFields = R.pipe(
  R.mapObjIndexed((val, key) => R.assoc('name', key, val)),
  R.map(({ read_only, ...props }) => ({ ...props, editable: !read_only })),
  R.omit(['required', 'read_only', 'max_length'])
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
    label: 'Publication date',
  },
  year: {
    type: 'integer',
    required: false,
    read_only: true,
    label: 'Year',
  },
  issue_name: {
    type: 'string',
    required: false,
    read_only: true,
    label: 'Issue name',
  },
  pdfs: {
    type: 'pdfs',
    required: false,
    read_only: true,
    label: 'Pdfs',
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
          label: 'Pages',
          help_text: 'Number of pages',
        },
        cover_page: {
          type: 'image upload',
          required: false,
          read_only: false,
          label: 'Cover page',
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
    label: 'Issue type',
    choices: [
      { value: 1, display_name: 'Vanlig' },
      { value: 2, display_name: 'Magasin' },
      { value: 3, display_name: 'Velkomstutgave' },
    ],
  },
}

export const detailFields = cleanFields(optionsFields)
