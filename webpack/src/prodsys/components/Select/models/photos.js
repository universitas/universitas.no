import optionWrapper from './optionWrapper.js'
import anonymous from 'images/anonymous.png'
import Debug from 'components/Debug'
import Thumb from 'components/Thumb'
import { formatDate, formatFileSize } from 'utils/text'

const formatCategory = n =>
  ['–', 'foto', 'illustrasjon', 'diagram', 'bylinefoto', 'ekstern'][n] || '?'

const reformat = ({
  created,
  category,
  filesize,
  width,
  height,
  ...props
}) => ({
  created: formatDate(created, 'YYYY-MM-DD HH:mm'),
  category: formatCategory(category),
  filesize: formatFileSize(filesize),
  size: `${width}×${height}`,
  ...props,
})

const fields = [
  'filename',
  'description',
  'category',
  'artist',
  'created',
  'size',
]

const Field = ({ name, value }) => (
  <div className={name} title={`${name}: ${value}`}>
    {value}
  </div>
)
const PhotoField = ({ src, title }) => (
  <div className="thumb" title={title}>
    <img className="popup" src={src} />
    <Thumb src={src} className="thumb" />
  </div>
)

const Option = R.pipe(reformat, ({ small, ...props }) => (
  <div className="PhotoOption">
    <PhotoField src={small} title={props.filename} />
    {R.map(name => <Field key={name} name={name} value={props[name]} />)(
      fields,
    )}
  </div>
))

export const reshape = props => ({ label: props.filename, ...props })

export const components = {
  Option: optionWrapper(Option),
}
