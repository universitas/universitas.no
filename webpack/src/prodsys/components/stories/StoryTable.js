import cx from 'classnames'
import { connect } from 'react-redux'
import { MODEL, fields, Field, actions, selectors } from './model.js'
import { Error, Save, Ok, Sync, Circle } from 'components/Icons'

import { getRoutePayload, toRoute } from 'prodsys/ducks/router'

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

const DumbDirtyIndicator = ({
  onClick,
  autoSave,
  className,
  status,
  saveHandler,
}) => {
  const statusIcon = {
    ok: <Ok style={{ opacity: 0.2 }} title="endringer lagret" />,
    dirty: autoSave ? (
      <Sync title="saken lagres automatisk" />
    ) : (
      <Save onClick={saveHandler} title="klikk for å lagre endringer" />
    ),
    syncing: <Sync className="syncing" title="lagrer" />,
    error: <Error style={{ color: 'yellow' }} title="noe gikk feil" />,
  }[status]
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        fontSize: '1.3rem',
      }}
      className={className}
    >
      {statusIcon}
    </div>
  )
}
const DirtyIndicator = connect(
  (state, { pk }) =>
    R.applySpec({
      autoSave: selectors.getAutosave,
      status: R.pipe(
        selectors.getItem(pk),
        R.prop('status'),
      ),
    })(state),
  (dispatch, { pk }) => ({
    saveHandler: () => dispatch(actions.itemPatch(pk, null)),
  }),
)(DumbDirtyIndicator)

// render all headers in table
const DumbTableRow = props => (
  <>
    <TableCell {...props} name="working_title" />
    <TableCell {...props} name="publication_status" />
    <TableCell {...props} name="story_type" />
    <TableCell {...props} name="modified" relative />
    <TableCell {...props} name="image_count" />
    <DirtyIndicator {...props} />
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
