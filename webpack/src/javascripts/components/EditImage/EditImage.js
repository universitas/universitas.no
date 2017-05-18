import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { CropBox } from '../CropBox/CropBox'
import { Previews } from '../CropBox/Previews'
import * as actions from './actions'
import * as moment from 'moment'
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
  dismiss: e => dispatch(actions.dismissWidget()),
  resize: e => dispatch(actions.resizeWidget()),
  cycle: e => dispatch(actions.cycleWidgetPanels()),
  autocrop: e => dispatch(actions.autocropImage(id)),
}))(Buttons)

const subset1 = d => ({
  id: d.id,
  created: moment(d.created).format('YYYY-MM-DD'),
  original: d.original,
  'original size': d.size,
  'cropping method': `${d.method} (${d.cropping_method})`,
  'crop box': d.crop_box,
  type: d.is_profile_image ? 'profile image' : 'photo',
  'image hash': d._imagehash,
})
const subset0 = d => ({
  filename: d.original.replace(/^.*\//g, ''),
  created: moment(d.created).format('ll'),
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

let EditImage = ({ id = 0, image = {}, panels, expanded }) => {
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
  const data = [subset0, subset1, subset2][panels](image)
  return (
    <div className="EditImage" style={style}>
      <Previews image={image} src={image.large} aspects={[1, 0.5, 2.5]} />
      <CropBox {...image} src={image.large} />
      <ImageData {...data} />
      <Buttons id={id} expanded={expanded} />
    </div>
  )
}
EditImage = connect(
  ({ cropWidget, images }) =>
    cropWidget ? { ...cropWidget, image: images[cropWidget.id] } : {}
)(EditImage)

export { EditImage }
