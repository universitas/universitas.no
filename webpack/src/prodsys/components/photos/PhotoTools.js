import { connect } from 'react-redux'
import { Magic, Add, Delete, Laptop, Tune, Close } from 'components/Icons'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { push } from 'redux-little-router'
import { pushPhoto } from 'ducks/storyimage'
import { selectors, actions, MODEL } from './model.js'

const openUrl = url => () => window.open(url)

const Tool__ = ({ Icon, ...props }) => (
  <div className="Tool" {...props}>
    <Icon />
  </div>
)

const PhotoTools = ({
  autocrop,
  close,
  pushPhoto,
  openAdmin,
  filename,
  pk,
}) => (
  <DetailTopBar title={filename} pk={pk}>
    <Tool icon="Close" title="lukk bildet" onClick={close} />
    <Tool icon="Download" title="last opp til desken" onClick={pushPhoto} />
    <Tool icon="Tune" title="rediger i django-admin" onClick={openAdmin} />
  </DetailTopBar>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  autocrop: () => dispatch(actions.fieldChanged(pk, 'cropping_method', 1)),
  pushPhoto: () => dispatch(pushPhoto(pk)),
  close: () => dispatch(push(`/${MODEL}`)),
  openAdmin: openUrl(`/admin/photo/imagefile/${pk}/change/`),
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotoTools)
