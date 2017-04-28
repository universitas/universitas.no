import React from 'react'
import './cropinfo.scss'
import { connect } from 'react-redux'

const InfoBox = ({ items }) => (
  <div className="infoBoxWrapper">
    <div className="infoBox">
      {Object.keys(items).map(key => (
        <div className="infoRow" key={key} >
          <div className="label">{key}:</div>
          <div className="value">{items[key]}</div>
        </div>
      ))}
    </div>
  </div>
)
InfoBox.propTypes = {
  items: React.PropTypes.object,
}


const mapStateToProps = (state, { src }) => {
  const crop = state.images[src].crop
  const [left, x, right, top, y, bottom] = [...crop.v, ...crop.h]
    .map(num => num.toFixed(3))
  return { items: { left, top, right, bottom, x, y } }
}

const CropInfo = connect(mapStateToProps)(InfoBox)
export { CropInfo, InfoBox }
