import { Tablet, Binoculars, Mobile, Desktop, Laptop } from 'components/Icons'
import './ZoomControl.scss'
import { getUx, getZoom, setZoom } from 'ducks/ux'
import { connect } from 'react-redux'
import cx from 'classnames'

const mapStateToProps = (state, { value }) => ({
  active: value == getZoom(state),
})
const mapDispatchToProps = { setZoom }
const ZoomButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(({ Icon, value, active, setZoom }) => (
  <div
    className={cx('ZoomButton', { active })}
    onClick={() => setZoom(active ? undefined : value)}
  >
    <Icon className={cx('Icon')} />
  </div>
))

const ZoomSlider = props => {
  return (
    <div className="ZoomSlider" {...props}>
      <ZoomButton value={400} Icon={Mobile} />
      <ZoomButton value={750} Icon={Tablet} />
      <ZoomButton value={1200} Icon={Laptop} />
      <ZoomButton value={2000} Icon={Desktop} />
      <ZoomButton value={5000} Icon={Binoculars} />
    </div>
  )
}

const ZoomControl = ({
  changeHandler,
  resetHandler,
  value = '',
  min = 300,
  max = 3500,
  step = 100,
}) => (
  <div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      onDoubleClick={resetHandler}
      onChange={e => changeHandler(e.target.value)}
      value={value}
    />
    <output>{value}</output>
  </div>
)

export default ZoomSlider
