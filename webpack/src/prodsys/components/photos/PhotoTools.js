import { connect } from 'react-redux'
import { Crop, Magic, Add, Delete, Laptop, Tune, Close } from 'components/Icons'
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
  detail,
  toggleCrop,
  pk,
}) => (
  <DetailTopBar title={filename} pk={pk}>
    <Tool icon="Close" title="lukk bildet" onClick={close} />
    <Tool
      active={detail == 'crop'}
      icon="Crop"
      title="toggle crop"
      onClick={() => toggleCrop(detail == 'crop' ? null : 'crop')}
    />
    <Tool icon="Download" title="last opp til desken" onClick={pushPhoto} />
    <Tool icon="Tune" title="rediger i django-admin" onClick={openAdmin} />
  </DetailTopBar>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)

const mapDispatchToProps = (dispatch, { pk }) => ({
  autocrop: () => dispatch(actions.fieldChanged(pk, 'cropping_method', 1)),
  toggleCrop: detail => dispatch(actions.reverseUrl({ detail })),
  pushPhoto: () => dispatch(pushPhoto(pk)),
  close: () => dispatch(push(`/${MODEL}`)),
  openAdmin: openUrl(`/admin/photo/imagefile/${pk}/change/`),
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotoTools)
