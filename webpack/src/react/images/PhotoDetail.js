import { connect } from 'react-redux'
import { detailFields as fields } from 'images/model'
import PhotoTools from 'images/PhotoTools'
import ModelField from 'components/ModelField'
import { modelSelectors } from 'ducks/basemodel'

const model = 'images'

const PhotoDetail = ({ pk }) => (
  <section className="DetailPanel">
    <PhotoTools pk={pk} />
    <div className="panelContent">
      <ModelField {...{ pk, model, ...fields.large }} />
      <ModelField {...{ pk, model, ...fields.name }} />
      <ModelField {...{ pk, model, ...fields.description }} />
      <ModelField {...{ pk, model, ...fields.category }} />
      <ModelField {...{ pk, model, ...fields.artist }} />
      <ModelField {...{ pk, model, ...fields.original }} />
      <ModelField {...{ pk, model, ...fields.usage }} />
      <ModelField {...{ pk, model, ...fields.created }} />
      <ModelField {...{ pk, model, ...fields.size }} />
    </div>
  </section>
)

const { getCurrentItemId: pk } = modelSelectors(model)
export default connect(R.applySpec({ pk }))(PhotoDetail)
