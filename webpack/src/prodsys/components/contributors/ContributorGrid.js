import cx from 'classnames'
import { connect } from 'react-redux'
import ModelField from 'components/ModelField'
import { fields, actions, selectors, MODEL } from './model.js'
import { toRoute, getRoutePayload } from 'prodsys/ducks/router'

const Field = ({ name, ...props }) => (
  <ModelField
    key={name}
    name={name}
    model={MODEL}
    {...fields[name]}
    {...props}
    editable={false}
  />
)

const GridItem = ({ pk, onClick, className = '' }) => (
  <div key={pk} onClick={onClick} className={cx('GridItem', className)}>
    <Field pk={pk} name="thumb" label />
    <Field pk={pk} name="display_name" label />
    <Field pk={pk} name="title" />
    <Field pk={pk} name="email" />
    <Field pk={pk} name="phone" />
  </div>
)

const ConnectedGridItem = connect(
  (state, { pk }) => {
    const data = selectors.getItem(pk)(state) || {}
    const selected = R.pipe(
      getRoutePayload,
      R.propEq('pk', pk),
    )(state)
    const { dirty } = data
    const className = cx('GridItem', { dirty, selected })
    return { ...data, className }
  },
  (dispatch, { pk }) => ({
    onClick: e => dispatch(toRoute({ model: MODEL, action: 'change', pk: pk })),
  }),
)(GridItem)

const ContributorGrid = ({ items = [] }) => (
  <div className="ItemGrid">
    {items.map(pk => (
      <ConnectedGridItem key={pk} fields={fields} pk={pk} />
    ))}
  </div>
)
export default connect(state => ({ items: selectors.getItemList(state) }))(
  ContributorGrid,
)
