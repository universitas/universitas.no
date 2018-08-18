import cx from 'classnames'
import { connect } from 'react-redux'
import { ContributorTools } from '.'
import ModelField from 'components/ModelField'
import { fields, selectors, MODEL } from './model.js'

const ContributorDetail = ({ pk }) => {
  const props = { pk, model: MODEL }
  return (
    <section className="DetailPanel">
      <ContributorTools pk={pk} />
      <div className="panelContent">
        <ModelField {...{ ...props, ...fields.display_name }} />
        <ModelField {...{ ...props, ...fields.status }} />
        <ModelField {...{ ...props, ...fields.email }} />
        <ModelField {...{ ...props, ...fields.phone }} />
        <ModelField {...{ ...props, ...fields.thumb }} />
        <ModelField {...{ ...props, ...fields.stint_set }} />
      </div>
    </section>
  )
}

export default connect(R.applySpec({ pk: selectors.getCurrentItemId }))(
  ContributorDetail,
)
