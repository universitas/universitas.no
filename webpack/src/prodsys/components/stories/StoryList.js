import cx from 'classnames'
import { Clear } from 'components/Icons'
import ListPanel from 'components/ListPanel'
import StoryTable from './StoryTable.js'
import StoryDetailPreview from './StoryDetailPreview.js'
import PhotoList from 'components/photos/PhotoList.js'
import { MODEL, fields, selectors } from './model.js'
import { connect } from 'react-redux'

const filters = R.pipe(
  R.path(['publication_status', 'options']),
  R.map(({ label, options }) => ({
    label,
    value: R.pluck('value', options),
    attr: 'publication_status__in',
    model: MODEL,
    toggle: true,
    title: 'kategori: ' + R.join(', ', R.pluck('label', options)),
  })),
  R.append({
    toggle: true,
    attr: 'ordering',
    model: MODEL,
    value: '-modified',
    label: 'sist endret',
  }),
)(fields)

const StoryList = ({ action, pk }) => {
  if (pk && action == 'images')
    return (
      <React.Fragment>
        <Stories style={{ flex: 0.5 }} />
        <Photos pk={pk} />
      </React.Fragment>
    )
  return <Stories />
}

const Photos = connect((state, { pk }) =>
  R.pipe(
    selectors.getItem(pk),
    R.propOr([], 'images'),
    R.pluck('imagefile'),
    R.objOf('selected'),
    R.assoc('action', 'images'),
  )(state),
)(PhotoList)

const Stories = props => (
  <ListPanel model={MODEL} filters={filters} {...props}>
    <StoryTable />
  </ListPanel>
)

export default StoryList
