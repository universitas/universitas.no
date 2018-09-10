import { connect } from 'react-redux'
import { Crop, Magic, Add, Delete, Laptop, Tune, Close } from 'components/Icons'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { pushPhoto } from 'ducks/storyimage'
import { selectors, actions, MODEL } from './model.js'
import { toRoute } from 'prodsys/ducks/router'

const openUrl = url => () => window.open(url)

const PhotoTools = ({
  autocrop,
  close,
  pushPhoto,
  openAdmin,
  filename,
  action,
  toggleCrop,
  pk,
}) => (
  <DetailTopBar title={filename} pk={pk}>
    <Tool icon="Close" title="lukk bildet" onClick={close} />
    <Tool
      active={action == 'crop'}
      icon="Crop"
      title="toggle crop"
      onClick={() => toggleCrop(action == 'crop' ? null : 'crop')}
    />
    <Tool icon="Download" title="last opp til desken" onClick={pushPhoto} />
    <Tool icon="Tune" title="rediger i django-admin" onClick={openAdmin} />
  </DetailTopBar>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk, action }) => ({
  autocrop: () => dispatch(actions.fieldChanged(pk, 'cropping_method', 1)),
  toggleCrop: () =>
    dispatch(
      toRoute({
        pk: pk,
        model: MODEL,
        action: action == 'crop' ? 'change' : 'crop',
      }),
    ),
  pushPhoto: () => dispatch(pushPhoto(pk)),
  close: () => dispatch(toRoute({ model: MODEL })),
  openAdmin: openUrl(`/admin/photo/imagefile/${pk}/change/`),
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotoTools)
