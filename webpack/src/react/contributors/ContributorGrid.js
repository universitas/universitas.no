import 'styles/storylist.scss'
import cx from 'classnames'
import { push } from 'redux-little-router'
import { connect } from 'react-redux'
import { detailFields as fields } from 'contributors/model'
import { modelSelectors } from 'ducks/basemodel'
import ModelField from 'components/ModelField'

const MODEL = 'contributors'

const { getItemList, getItem, getCurrentItemId } = modelSelectors(MODEL)

const ContributorField = ({ editable, ...props }) => (
  <ModelField editable={false} model={MODEL} {...props} />
)

const GridItem = ({ pk, onClick, className = '' }) => (
  <div key={pk} onClick={onClick} className={cx('GridItem', className)}>
    <ContributorField pk={pk} {...fields.display_name} />
    <ContributorField pk={pk} {...fields.phone} />
    <ContributorField pk={pk} {...fields.email} label />
    <ContributorField pk={pk} {...fields.thumb} label />
  </div>
)

const ConnectedGridItem = connect(
  (state, { pk }) => {
    const data = getItem(pk)(state) || {}
    const selected = getCurrentItemId(state) === pk
    const { dirty } = data
    const className = cx('GridItem', { dirty, selected })
    return { ...data, className, model: MODEL }
  },
  (dispatch, { pk }) => ({ onClick: e => dispatch(push(`/${MODEL}/${pk}`)) })
)(GridItem)

const ItemGrid = ({ items = [] }) => (
  <div className="ItemGrid">
    {items.map(pk => <ConnectedGridItem fields={fields} pk={pk} />)}
  </div>
)
export default connect(state => ({ items: getItemList(state) }))(ItemGrid)
