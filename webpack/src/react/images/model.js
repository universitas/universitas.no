const optionsFields = {
  id: {
    type: 'integer',
    required: false,
    read_only: true,
    label: 'ID',
  },
  url: {
    type: 'url',
    required: false,
    read_only: true,
    label: 'Url',
  },
  name: {
    type: 'string',
    required: false,
    read_only: true,
    label: 'Filnavn',
  },
  created: {
    type: 'datetime',
    required: false,
    read_only: true,
    label: 'Opprettet',
  },
  cropping_method: {
    type: 'choice',
    required: false,
    read_only: false,
    label: 'Beskjæringsmetode',
    help_text: 'Metode for beskjæring',
    choices: [
      { value: 0, display_name: 'midtpunkt' },
      { value: 1, display_name: 'i kø' },
      { value: 5, display_name: 'detaljer' },
      { value: 10, display_name: 'ansikter' },
      { value: 15, display_name: 'portrett' },
      { value: 100, display_name: 'manuell beskjæring' },
    ],
  },
  method: {
    type: 'string',
    required: false,
    read_only: true,
    label: 'Method',
  },
  size: {
    type: 'size',
    required: false,
    read_only: true,
    label: 'Størrelse',
  },
  original: {
    type: 'link',
    required: false,
    read_only: true,
    label: 'Original',
  },
  thumb: {
    type: 'thumb',
    required: false,
    read_only: true,
    label: 'Thumb',
  },
  small: {
    type: 'thumb',
    required: false,
    read_only: true,
    label: 'Liten',
  },
  large: {
    type: 'image',
    required: false,
    read_only: true,
    label: 'Bilde',
  },
  description: {
    type: 'shorttext',
    required: false,
    read_only: false,
    label: 'Beskrivelse',
    help_text: 'Kort beskrivelse av bildet',
    max_length: 1000,
    rows: 4,
  },
  usage: {
    type: 'integer',
    required: false,
    read_only: true,
    label: 'Artikler',
  },
  _imagehash: {
    type: 'string',
    required: false,
    read_only: true,
    label: 'Bilde-hash',
    help_text: 'unik bildekode ved dhash-algoritmen',
  },
  crop_box: {
    type: 'cropbox',
    required: true,
    read_only: false,
    label: 'Beskjæring',
  },
  is_profile_image: {
    type: 'boolean',
    required: false,
    read_only: true,
    label: 'Bylinebilde',
  },
}

const cleanFields = R.pipe(
  R.mapObjIndexed((val, key) => R.assoc('name', key, val)),
  R.map(({ read_only, ...props }) => ({ ...props, editable: !read_only })),
  R.omit(['required', 'read_only', 'max_length'])
)

export const detailFields = cleanFields(optionsFields)
