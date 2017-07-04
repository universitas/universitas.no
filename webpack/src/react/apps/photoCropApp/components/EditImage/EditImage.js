import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { CropBox } from '../CropBox/CropBox'
import { Previews } from '../CropBox/Previews'
import { getImage } from '../../ducks/images'
import { getCropWidget } from '../../ducks/cropWidget'
import {
  getCropPanel,
  dismissPanel,
  resizePanel,
  cyclePanelData,
} from '../../ducks/cropPanel'
import { autocropImage } from '../../ducks/images'
import format from 'date-fns/format'
import './editimage.scss'

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
          <th>{key}</th><td>{prepare(value)}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

let EditImage = ({
  id = 0,
  image = {},
  data,
  expanded,
  crop_box,
  dragging,
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
  const { large: src, size, cropping_method } = image
  const pending = cropping_method === 0
  const aspects = [1, 0.5, 2.5]
  const cropBoxProps = { id, src, size, dragging, crop_box, pending }
  const previewsProps = { src, size, crop_box, aspects }
  return (
    <div className="EditImage" style={style}>
      <Previews {...previewsProps} />
      <CropBox {...cropBoxProps} />
      <ImageData {...pdata} />
      <Buttons id={id} expanded={expanded} />
    </div>
  )
}
EditImage = connect(state => {
  const { image: id, expanded, data } = getCropPanel(state)
  const { dragging, crop_box } = getCropWidget(state)
  const image = getImage(state, id)
  return { id, image, dragging, crop_box, expanded, data }
})(EditImage)

export { EditImage }
