import 'styles/editimage.scss'
import { connect } from 'react-redux'
import format from 'date-fns/format'

import CropBox from '@haakenlid/photocrop'
// import CropBox from 'x/components/CropBox'
// import CropPreview from 'x/components/CropPreview'
import { getImage, cropImage, autocropImage } from 'x/ducks/images'
import {
  getCropPanel,
  dismissPanel,
  resizePanel,
  cyclePanelData,
} from 'x/ducks/cropPanel'

const Spinner = () => <div className="spinner">Loading...</div>

let Buttons = ({ dismiss, expanded, resize, cycle, autocrop }) => (
  <div className="Buttons">
    <button onClick={dismiss}>Close</button>
    <button onClick={autocrop}>Autocrop</button>
    <button onClick={resize}>{expanded ? 'Smaller' : 'Larger'}</button>
    <button onClick={cycle}>Data</button>
  </div>
)
Buttons = connect(null, (dispatch, { id }) => ({
  dismiss: e => dispatch(dismissPanel()),
  resize: e => dispatch(resizePanel()),
  cycle: e => dispatch(cyclePanelData()),
  autocrop: e => dispatch(autocropImage(id)),
}))(Buttons)

const subset1 = d => ({
  id: d.id,
  created: format(d.created, 'YYYY-MM-DD'),
  original: d.original,
  'original size': d.size,
  'cropping method': `${d.method} (${d.cropping_method})`,
  'crop box': d.crop_box,
  type: d.is_profile_image ? 'profile image' : 'photo',
  'image hash': d._imagehash,
})
const subset0 = d => ({
  filename: d.original.replace(/^.*\//g, ''),
  created: format(d.created, 'MMM D, YYYY'),
  description: d.description,
  'used in stories': d.usage,
})
const subset2 = () => ({})

const prepare = val => {
  if (typeof val === 'string') {
    return val.match(/^https?:\/\//) ? <a href={val}>{val}</a> : val
  } else if (Array.isArray(val)) {
    return JSON.stringify(val, null, ' ')
  } else {
    return <pre>{JSON.stringify(val, null, ' ')}</pre>
  }
}

const ImageData = data => (
  <table className="ImageData">
    <tbody>
      {Object.entries(data).map(([key, value], i) => (
        <tr key={i}>
          <th>{key}</th>
          <td>{prepare(value)}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export const EditImage = ({
  id = 0,
  image = {},
  data,
  expanded,
  cropImage,
}) => {
  const style = expanded ? { flex: 3 } : { flex: 1 }
  style.pointerEvents = 'all'
  if (!id) return null
  if (!image.id) {
    return (
      <div className="EditImage" style={style}>
        <Spinner />
      </div>
    )
  }
  const pdata = [subset0, subset1, subset2][data](image)
  const { large: src, crop_box } = image
  const previews = [1, 0.5, 2.5]
  return (
    <div className="EditImage" style={style}>
      <CropBox
        src={src}
        value={crop_box}
        previews={previews}
        onChange={value => cropImage(id, value)}
      />
      <ImageData {...pdata} />
      <Buttons id={id} expanded={expanded} />
    </div>
  )
}

export default connect(
  state => {
    const { image: id, expanded, data } = getCropPanel(state)
    const image = getImage(state, id)
    return { id, image, expanded, data }
  },
  { cropImage },
)(EditImage)
