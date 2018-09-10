import cx from 'classnames'
import { connect } from 'react-redux'
import ListPanel from 'components/ListPanel'
import { Clear } from 'components/Icons'
import { FrontpageGrid } from '.'
import { MODEL, fields, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'

const filters = [
  {
    toggle: true,
    model: MODEL,
    attr: 'language',
    value: 'nor',
    label: 'norsk',
  },
  {
    toggle: true,
    model: MODEL,
    attr: 'language',
    value: 'eng',
    label: 'engelsk',
  },
]

const FrontpageList = ({ dismiss, items }) => {
  return (
    <ListPanel onClick={dismiss} model={MODEL} filters={filters}>
      <FrontpageGrid items={items} />
    </ListPanel>
  )
}

const mapStateToProps = (state, ownProps) => {
  const ids = selectors.getItemList(state)
  const items = selectors.getItems(state)
  const sorted = R.pipe(
    R.pick(ids),
    R.map(props => ({
      ...props,
      sortKey: props.baserank + parseFloat(props.priority),
    })),
    R.values,
    R.sortWith([R.descend(R.prop('sortKey'))]),
    R.pluck('id'),
  )

  return { items: sorted(items) }
}

export default connect(mapStateToProps, {
  dismiss: e => toRoute({ model: MODEL }),
})(FrontpageList)
