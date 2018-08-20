import { connect } from 'react-redux'
import { MODEL as model, fields, selectors, actions } from './model.js'
import { PhotoTools } from '.'
import ModelField from 'components/ModelField'
import PhotoCrop from '@haakenlid/photocrop'
import Debug from 'components/Debug'

const CropField = connect((state, { pk }) => selectors.getItem(pk)(state), {
  onChange: actions.fieldChanged,
})(({ pk, large, crop_box, width, height, onChange }) => (
  <div className="ModelField image">
    <label className="label">beskjæring</label>
    <div className="Thumb value" style={{ padding: '0.5rem' }}>
      <PhotoCrop
        previews={[0.5, 1, 2.5]}
        src={large}
        value={crop_box}
        size={[width, height]}
        onChange={value => onChange(pk, 'crop_box', value)}
      />
    </div>
  </div>
))

const PhotoDetail = ({ pk, detail }) => (
  <section className="DetailPanel">
    <PhotoTools pk={pk} detail={detail} />
    <div className="panelContent">
      {detail == 'crop' ? (
        <CropField pk={pk} />
      ) : (
        <ModelField {...{ pk, model, ...fields.large }} />
      )}
      <ModelField {...{ pk, model, ...fields.description }} />
      <div className="wrapForm">
        <ModelField {...{ pk, model, ...fields.artist }} />
        <ModelField {...{ pk, model, ...fields.filename }} />
        <ModelField {...{ pk, model, ...fields.category }} />
        <ModelField {...{ pk, model, ...fields.original }} />
        <ModelField {...{ pk, model, ...fields.usage }} />
        <ModelField {...{ pk, model, ...fields.created }} />
        <ModelField {...{ pk, model, ...fields.filesize }} />
        <ModelField {...{ pk, model, ...fields.height }} />
        <ModelField {...{ pk, model, ...fields.width }} />
      </div>
    </div>
  </section>
)

const getRouter = R.path(['router', 'params'])

export default connect(
  R.applySpec({
    pk: selectors.getCurrentItemId,
    detail: R.pipe(getRouter, R.propOr('normal', 'detail')),
  }),
)(PhotoDetail)
