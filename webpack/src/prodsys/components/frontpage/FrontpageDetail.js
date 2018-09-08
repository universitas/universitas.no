import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import cx from 'classnames'
import { FrontpageTools } from '.'
import { fields, MODEL, selectors, actions } from './model.js'
import StyleButtons from './StyleButtons.js'
import Debug from 'components/Debug'
import GridWidget from './GridWidget.js'

const CropBox = connect(selectors.getCurrentItem, dispatch => ({
  changeHandler: (pk, name) => value =>
    dispatch(actions.fieldChanged(pk, name, value)),
}))(({ id, image_id, crop_box, changeHandler }) => {
  return image_id ? (
    <ModelField
      editable
      pk={image_id}
      onChange={changeHandler(id, 'crop_box')}
      value={crop_box}
      type="cropbox"
      name="crop_box"
      model="photos"
      label="beskjæring"
    />
  ) : null
})

const Field = ({ name, ...props }) => (
  <ModelField
    key={name}
    name={name}
    model={MODEL}
    {...fields[name]}
    {...props}
  />
)

const FrontpageDetail = ({ pk }) => (
  <section className="DetailPanel" key={pk} style={{ maxWidth: '30rem' }}>
    <FrontpageTools pk={pk} />
    <div className="panelContent">
      {pk ? (
        <React.Fragment>
          <Field pk={pk} name="vignette" />
          <Field pk={pk} name="kicker" />
          <Field pk={pk} name="headline" />
          <Field pk={pk} name="lede" />
          <Field pk={pk} name="priority" />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <StyleButtons pk={pk} />
            <GridWidget pk={pk} />
          </div>
          <Field pk={pk} name="image_id" />
          <CropBox />
        </React.Fragment>
      ) : (
        <div>velg en sak</div>
      )}
    </div>
  </section>
)

export default connect(R.applySpec({ pk: selectors.getCurrentItemId }))(
  FrontpageDetail,
)
