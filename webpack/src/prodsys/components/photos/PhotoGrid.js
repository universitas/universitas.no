import cx from 'classnames'
import { connect } from 'react-redux'
import Thumb from 'components/Thumb'
import PhotoStats from './PhotoStats.js'
import { MODEL, actions, selectors } from './model.js'
import { Add, Delete } from 'components/Icons'
import { Tool } from 'components/tool'
import './PhotoGrid.scss'
import { getRoutePayload, toRoute } from 'prodsys/ducks/router'
import { assignPhoto } from 'ducks/storyimage'

const Frame = () => <rect className="Frame" width="100%" height="100%" />

const FullThumbWithCropBox = ({
  src,
  title,
  width = 0,
  height = 0,
  crop_box,
}) => {
  if (!width || !height) return
  const { left, x, right, top, y, bottom } = crop_box
  const boxPath = `M0, 0H1V1H0Z M${left}, ${top}V${bottom}H${right}V${top}Z`
  return (
    <svg className="Thumb" viewBox={`0 0 ${width} ${height}`}>
      <image xlinkHref={src} width="100%" height="100%" />
      <svg
        viewBox="0 0 1 1"
        preserveAspectRatio="none"
        height="100%"
        width="100%"
      >
        <path className="cropOverlay" fillRule="evenodd" d={boxPath} />
      </svg>
      <Frame />
    </svg>
  )
}

const FullThumb = ({ src, title, width = 0, height = 0 }) => (
  <svg className="Thumb" viewBox={`0 0 ${width} ${height}`}>
    <image xlinkHref={src} width="100%" height="100%" />
    <Frame />
  </svg>
)

const AssignPhoto = ({ pk, selected, ...props }) => (
  <div
    className={cx('assign', { selected })}
    {...props}
    title={selected ? 'fjern bilde fra saken' : 'legg til bilde'}
  >
    <Tool icon={selected ? 'Delete' : 'Add'} />
  </div>
)

const GridItem = ({
  pk,
  action,
  small,
  className,
  selected,
  viewPhoto,
  assignPhoto,
  ...data
}) => (
  <div key={pk} onClick={viewPhoto} className={className}>
    {action == 'images' && (
      <AssignPhoto pk={pk} selected={selected} onClick={assignPhoto} />
    )}
    {action == 'crop' ? (
      <FullThumbWithCropBox src={small} title={data.filename} {...data} />
    ) : (
      <FullThumb src={small} title={data.filename} {...data} />
    )}
    <PhotoStats pk={pk} {...data} />
  </div>
)

const mapStateToProps = (state, { pk, selected, action }) => {
  const data = selectors.getItem(pk)(state)
  const className = cx('GridItem', { dirty: data.dirty, selected })
  return { ...data, className, action, selected }
}
const mapDispatchToProps = (dispatch, { action, pk, story }) => ({
  viewPhoto: () =>
    action != 'images' &&
    dispatch(
      toRoute({
        pk,
        model: MODEL,
        action: action == 'list' ? 'change' : action,
      }),
    ),
  assignPhoto: () => action == 'images' && dispatch(assignPhoto(pk, story)),
})
const ConnectedGridItem = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GridItem)

const PhotoGrid = ({ selected = [], items = [], action, story }) => (
  <div className="ItemGrid">
    {selected.map(pk => (
      <ConnectedGridItem
        key={pk}
        pk={pk}
        action={action}
        story={story}
        selected
      />
    ))}
    {R.without(selected, items).map(pk => (
      <ConnectedGridItem key={pk} pk={pk} action={action} story={story} />
    ))}
  </div>
)
export default connect((state, { action, selected = [] }) => ({
  story: action == 'images' && getRoutePayload(state).pk,
  selected: R.sort(R.sub, selected),
  items: selectors.getItemList(state),
}))(PhotoGrid)
