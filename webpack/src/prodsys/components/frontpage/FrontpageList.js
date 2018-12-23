import cx from 'classnames'
import { connect } from 'react-redux'
import Panel from 'components/Panel'
import { ZoomControl, PreviewIframe } from 'components/PreviewIframe'
import Zoom from 'components/PreviewIframe'
import FrontpageGrid from './FrontpageGrid.js'
import { MODEL, fields, actions, selectors } from './model.js'
import { toRoute } from 'prodsys/ducks/router'
import Filters from 'components/ListPanel/Filter'

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

const header = (
  <>
    <Filters filters={filters} />
    <ZoomControl />
  </>
)

const FrontpageList = ({ dismiss, items }) => {
  return (
    <Panel header={header} scroll={false}>
      <PreviewIframe>
        <FrontpageGrid items={items} />
      </PreviewIframe>
    </Panel>
  )
}

const mapStateToProps = (state, ownProps) => {
  const ids = selectors.getItemList(state)
  const items = selectors.getItems(state)
  const sorted = R.pipe(
    R.pick(ids),
    R.values,
    R.map(({ id, baserank, priority }) => ({
      id,
      sortKey: baserank + parseFloat(priority),
    })),
    R.sortWith([R.descend(R.prop('sortKey'))]),
    R.pluck('id'),
  )
  return { items: sorted(items) }
}

export default connect(
  mapStateToProps,
  {
    dismiss: e => toRoute({ model: MODEL }),
  },
)(FrontpageList)
