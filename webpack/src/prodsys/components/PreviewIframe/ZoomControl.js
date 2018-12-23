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
    title={
      active
        ? 'nullstill zoomnivå'
        : `zoomnivå for\nforhåndsvisning\n${value}px i bredde`
    }
  >
    <Icon className={cx('Icon')} />
  </div>
))

const ZoomControl = props => {
  return (
    <div
      className="ZoomControl"
      title="Velg zoomnivå for forhåndsvisning"
      {...props}
    >
      <ZoomButton value={400} Icon={Mobile} />
      <ZoomButton value={750} Icon={Tablet} />
      <ZoomButton value={1200} Icon={Laptop} />
      <ZoomButton value={2000} Icon={Desktop} />
      <ZoomButton value={5000} Icon={Binoculars} />
    </div>
  )
}

export default ZoomControl
