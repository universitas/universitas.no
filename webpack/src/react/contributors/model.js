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
      {
        value: 0,
        display_name: 'Ukjent',
      },
      {
        value: 1,
        display_name: 'Aktiv',
      },
      {
        value: 2,
        display_name: 'Slutta',
      },
      {
        value: 3,
        display_name: 'Ekstern',
      },
    ],
  },
  display_name: {
    type: 'string',
    required: false,
    read_only: false,
    label: 'Navn',
    max_length: 50,
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
    type: 'image',
    required: false,
    read_only: true,
    label: 'Byline photo',
  },
  thumb: {
    type: 'thumb',
    required: false,
    read_only: true,
    label: 'Bylinebilde',
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

export const detailFields = cleanFields(optionsFields)
