import 'styles/storylist.scss'
import cx from 'classnames'
import { connect } from 'react-redux'
import { detailFields as fields } from 'contributors/model'
import { modelActions, modelSelectors } from 'ducks/basemodel'
import ModelField from 'components/ModelField'

const MODEL = 'contributors'

const { getItemList, getItem, getCurrentItemId } = modelSelectors(MODEL)
const { reverseUrl } = modelActions(MODEL)

const ContributorField = ({ editable, ...props }) => (
  <ModelField editable={false} model={MODEL} {...props} />
)

const GridItem = ({ pk, onClick, className = '' }) => (
  <div key={pk} onClick={onClick} className={cx('GridItem', className)}>
    <ContributorField pk={pk} {...fields.thumb} label />
    <ContributorField pk={pk} {...fields.display_name} label />
    <ContributorField pk={pk} {...fields.email} label />
    <ContributorField pk={pk} {...fields.phone} label />
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
  (dispatch, { pk }) => ({ onClick: e => dispatch(reverseUrl({ id: pk })) })
)(GridItem)

const ContributorGrid = ({ items = [] }) => (
  <div className="ItemGrid">
    {items.map(pk => <ConnectedGridItem key={pk} fields={fields} pk={pk} />)}
  </div>
)
export default connect(state => ({ items: getItemList(state) }))(
  ContributorGrid
)
