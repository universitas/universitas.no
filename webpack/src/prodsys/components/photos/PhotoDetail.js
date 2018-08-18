import { connect } from 'react-redux'
import { fields, selectors } from './model.js'
import { PhotoTools } from '.'
import ModelField from 'components/ModelField'

const model = 'photos'

const PhotoDetail = ({ pk }) => (
  <section className="DetailPanel">
    <PhotoTools pk={pk} />
    <div className="panelContent">
      <ModelField {...{ pk, model, ...fields.large }} />
      <ModelField {...{ pk, model, ...fields.filename }} />
      <ModelField {...{ pk, model, ...fields.description }} />
      <ModelField {...{ pk, model, ...fields.category }} />
      <ModelField {...{ pk, model, ...fields.artist }} />
      <ModelField {...{ pk, model, ...fields.original }} />
      <ModelField {...{ pk, model, ...fields.usage }} />
      <ModelField {...{ pk, model, ...fields.created }} />
      <ModelField {...{ pk, model, ...fields.filesize }} />
      <ModelField {...{ pk, model, ...fields.height }} />
      <ModelField {...{ pk, model, ...fields.width }} />
    </div>
  </section>
)

export default connect(R.applySpec({ pk: selectors.getCurrentItemId }))(
  PhotoDetail,
)
