import cx from 'classnames'
import { connect } from 'react-redux'
import { MODEL, fields, Field, actions, selectors } from './model.js'
import { Error, Save, Ok, Sync, Circle } from 'components/Icons'
import { getRoutePayload, toRoute } from 'prodsys/ducks/router'
import './StoryTable.scss'

const TableCell = ({
  className,
  onClick,
  saveChanges,
  isDirty,
  name,
  ...props
}) => (
  <div
    title={R.path([name, 'label'], fields)}
    className={className}
    onClick={onClick}
  >
    <Field name={name} {...props} label="" />
  </div>
)

const iconAndTitle = (status, autoSave) =>
  ({
    ok: [Ok, 'endringer lagret'],
    dirty: autoSave
      ? [Sync, 'saken lagres automatisk']
      : [Save, 'klikk for å lagre'],
    syncing: [Sync, 'lagrer'],
    error: [Error, 'feil'],
  }[status])

let SaveIndicator = ({ onClick, autoSave, className, status, saveHandler }) => {
  const [Icon, title] = iconAndTitle(status, autoSave)
  return (
    <div
      title={title}
      onClick={status == 'dirty' ? saveHandler : onClick}
      className={cx('SaveIndicator', className, status)}
    >
      <Icon />
    </div>
  )
}

SaveIndicator = connect(
  (state, { pk }) =>
    R.applySpec({
      autoSave: selectors.getAutosave,
      status: selectors.getItemStatus(pk),
    })(state),
  (dispatch, { pk }) => ({
    saveHandler: () => dispatch(actions.itemSave(pk, null)),
  }),
)(SaveIndicator)

// render all headers in table
const DumbTableRow = props => (
  <>
    <TableCell {...props} name="working_title" />
    <TableCell {...props} name="publication_status" />
    <TableCell {...props} name="story_type" />
    <TableCell {...props} name="modified" relative />
    <TableCell {...props} name="image_count" />
    <SaveIndicator {...props} />
  </>
)

const TableRow = connect(
  (state, { pk, row, selected, action }) => {
    const data = selectors.getItem(pk)(state) || {}
    const className = cx('TableCell', `status-${data.publication_status}`, {
      selected,
      odd: row % 2,
    })
    return { className, pk }
  },
  (dispatch, { pk, action }) => ({
    onClick: e => dispatch(toRoute({ model: MODEL, action, pk: pk })),
  }),
)(DumbTableRow)

const StoryTable = ({ action, currentItem, items = [] }) => (
  <section className="StoryTable">
    {items.map((pk, index) => (
      <TableRow
        key={pk}
        pk={pk}
        row={index}
        action={action}
        selected={pk == currentItem}
      />
    ))}
  </section>
)
export default connect(state => {
  const { pk, action } = getRoutePayload(state)
  const items = selectors.getItemList(state)
  return {
    items,
    action: action == 'list' ? 'change' : action,
    currentItem: pk,
  }
})(StoryTable)
