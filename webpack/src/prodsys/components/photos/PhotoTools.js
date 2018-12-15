import { connect } from 'react-redux'
import { Crop, Magic, Add, Delete, Laptop, Tune, Close } from 'components/Icons'
import { Tool } from 'components/tool'
import DetailTopBar from 'components/DetailTopBar'
import { pushPhoto } from 'ducks/storyimage'
import { selectors, actions, MODEL } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'
import ModelTools from 'components/ModelTools'

const PhotoTools = ({
  autocrop,
  pushPhoto,
  openAdmin,
  filename,
  action,
  toggleCrop,
  upload,
  pk,
  cropping_method,
}) => (
  <ModelTools>
    <Tool
      icon="CameraRoll"
      title="last opp nye bilder"
      label="last opp"
      onClick={upload}
    />
    <Tool
      icon="Download"
      label="desken"
      title="last opp fila til desken"
      onClick={pushPhoto}
    />
    <Tool
      active={action == 'crop'}
      icon="Crop"
      title="tilpass beskjæring"
      label="tilpass"
      onClick={() => toggleCrop(action == 'crop' ? null : 'crop')}
    />
    <Tool
      disabled={cropping_method == 1}
      icon="Magic"
      label="auto"
      title="autobeskjær bilde"
      onClick={autocrop}
    />
    <OpenInDjangoAdmin pk={pk} path="photo/imagefile" />
  </ModelTools>
)

const mapStateToProps = (state, { pk }) => selectors.getItem(pk)(state)
const mapDispatchToProps = (dispatch, { pk, action }) => ({
  autocrop: () => {
    dispatch(actions.fieldChanged(pk, 'cropping_method', 1))
    setTimeout(() => dispatch(actions.itemRequested(pk, true)), 3000)
  },
  upload: () =>
    dispatch(
      toRoute({
        model: 'uploads',
      }),
    ),
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PhotoTools)
