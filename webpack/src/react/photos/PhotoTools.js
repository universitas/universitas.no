import { connect } from 'react-redux'
import { Magic, Add, Delete, Laptop, Tune, Close } from 'components/Icons'
import { push } from 'redux-little-router'
import { pushPhoto } from 'ducks/storyimage'
import { modelSelectors, modelActions } from 'ducks/basemodel'
import DetailTopBar from 'components/DetailTopBar'
import Tool from 'components/Tool'

const model = 'photos'
const { fieldChanged } = modelActions(model)
const { getItem } = modelSelectors(model)

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

const mapStateToProps = (state, { pk }) => getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  autocrop: () => dispatch(fieldChanged(pk, 'cropping_method', 1)),
  pushPhoto: () => dispatch(pushPhoto(pk)),
  close: () => dispatch(push(`/${model}`)),
  openAdmin: openUrl(`/admin/photo/imagefile/${pk}/change/`),
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotoTools)
