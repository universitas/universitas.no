import { connect } from 'react-redux'
import { Crop, Magic, Add, Delete, Laptop, Tune, Close } from 'components/Icons'
import { Tool } from 'components/tool'
import { pushPhoto } from 'ducks/actions.js'
import { selectors, actions, MODEL } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import ModelTools from 'components/ModelTools'
import OpenInDjangoAdmin from 'components/OpenInDjangoAdmin'

const PhotoTools = ({
  autocrop,
  openAdmin,
  filename,
  action,
  toggleCrop,
  upload,
  pk,
  pushPhoto,
  pushed = false,
  cropping_method,
}) => (
  <ModelTools>
    <Tool
      icon="CameraRoll"
      title="last opp nye bilder til prodsys"
      label="last opp"
      onClick={upload}
    />
    <Tool
      active={action == 'crop'}
      icon="Crop"
      title="tilpass beskjæring"
      label="tilpass"
      onClick={() => toggleCrop(action == 'crop' ? null : 'crop')}
    />
    <Tool
      disabled={!pk || cropping_method == 1}
      icon="Magic"
      label="auto"
      title={pk ? 'autobeskjær bilde' : 'velg bilde'}
      onClick={autocrop}
      order={3}
    />
    <Tool
      icon="Download"
      label="desken"
      disabled={!pk || pushed}
      title={pk ? 'last opp fila til desken' : 'velg bilde'}
      onClick={pushPhoto}
      order={4}
    />
    <OpenInDjangoAdmin pk={pk} path="photo/imagefile" />
  </ModelTools>
)

const mapStateToProps = (state, { pk }) =>
  R.pick(['filename', 'cropping_method', 'pushed'])(
    selectors.getItem(pk)(state),
  )
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
