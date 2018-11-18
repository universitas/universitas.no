import cx from 'classnames'
import { connect } from 'react-redux'
import Thumb from 'components/Thumb'
import { PhotoStats } from '.'
import { MODEL, actions, selectors } from './model.js'
import { Add, Delete } from 'components/Icons'
import { Tool } from 'components/tool'
import './PhotoGrid.scss'
import { getRoutePayload, toRoute } from 'prodsys/ducks/router'
import { assignPhoto } from 'ducks/storyimage'

const Frame = () => <rect className="Frame" width="100%" height="100%" />

const FullThumbWithCropBox = ({ src, title, width, height, crop_box }) => {
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

const FullThumb = ({ src, title, width, height }) => (
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
  clickAction,
  dispatch,
  small,
  className,
  selected,
  ...data
}) => (
  <div
    key={pk}
    onClick={action == 'images' ? null : () => dispatch(clickAction)}
    className={className}
  >
    {action == 'images' && (
      <AssignPhoto
        pk={pk}
        selected={selected}
        onClick={() => dispatch(clickAction)}
      />
    )}
    {action == 'crop' ? (
      <FullThumbWithCropBox src={small} title={data.filename} {...data} />
    ) : (
      <FullThumb src={small} title={data.filename} {...data} />
    )}
    <PhotoStats pk={pk} {...data} />
  </div>
)

const ConnectedGridItem = connect((state, { pk }) => {
  const { model, pk: currentItem, action } = getRoutePayload(state)
  const data = selectors.getItem(pk)(state) || {}
  const selected =
    model == 'photos'
      ? pk == currentItem
      : R.contains(pk, selectors.getSelectedItems(state))
  const clickAction =
    action == 'images'
      ? assignPhoto(pk, currentItem)
      : toRoute({
          model: MODEL,
          pk,
          action: action == 'list' ? 'change' : action,
        })
  const className = cx('GridItem', { dirty: data.dirty, selected })
  return { ...data, className, action, selected, clickAction }
})(GridItem)

const PhotoGrid = ({ items = [] }) => (
  <div className="ItemGrid">
    {items.map(pk => <ConnectedGridItem key={pk} pk={pk} />)}
  </div>
)
export default connect(state => ({ items: selectors.getItemList(state) }))(
  PhotoGrid,
)
