import { connect } from 'react-redux'
import EditImage from 'containers/EditImage'
import { getSelectedImage } from 'ducks/cropPanel'

const style = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  zIndex: 1000,
  background: 'none',
  pointerEvents: 'none',
}

const empty = {
  pointerEvents: 'none',
  flex: 2,
}

const mapStateToProps = state => ({
  active: getSelectedImage(state),
})

const CropBox = ({ active }) =>
  active
    ? <section className="FrontPageCrop" style={style}>
        <EditImage />
        <div style={empty} />
      </section>
    : null

export default connect(mapStateToProps)(CropBox)
