import { connect } from 'react-redux'
import { Crop, Magic, Add, Delete, Laptop, Tune, Close } from 'components/Icons'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { pushPhoto } from 'ducks/storyimage'
import { selectors, actions, MODEL } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'

const PhotoTools = ({
  autocrop,
  pushPhoto,
  openAdmin,
  filename,
  action,
  toggleCrop,
  pk,
}) => (
  <React.Fragment>
    <Tool
      active={action == 'crop'}
      icon="Crop"
      title="toggle crop"
      onClick={() => toggleCrop(action == 'crop' ? null : 'crop')}
    />
    <Tool icon="Download" title="last opp til desken" onClick={pushPhoto} />
    <OpenInDjangoAdmin pk={pk} path="photo/imagefile" />
  </React.Fragment>
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
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotoTools)
