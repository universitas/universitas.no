import cx from 'classnames'
import { connect } from 'react-redux'
import Thumb from 'components/Thumb'
import { PhotoStats } from '.'
import { MODEL as model, actions, selectors } from './model.js'
import { Add, Delete } from 'components/Icons'
import { Tool } from 'components/tool'
import './PhotoGrid.scss'

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
  detail,
  onClick,
  small,
  className,
  selected,
  ...data
}) => (
  <div
    key={pk}
    onClick={detail == 'images' ? null : onClick}
    className={className}
  >
    {detail == 'images' && (
      <AssignPhoto pk={pk} selected={selected} onClick={onClick} />
    )}
    {detail == 'crop' ? (
      <FullThumbWithCropBox src={small} title={data.filename} {...data} />
    ) : (
      <FullThumb src={small} title={data.filename} {...data} />
    )}
    <PhotoStats pk={pk} {...data} />
  </div>
)

const ConnectedGridItem = connect(
  (state, { pk }) => {
    const data = selectors.getItem(pk)(state) || {}
    const selected = R.contains(pk, selectors.getSelectedItems(state))
    const { dirty } = data
    const className = cx('GridItem', { dirty, selected })
    const detail = R.pathOr(null, ['router', 'params', 'detail'], state)
    return { ...data, className, model, detail, selected }
  },
  (dispatch, { clickAction }) => ({ onClick: e => dispatch(clickAction) }),
)(GridItem)

const PhotoGrid = ({
  items = [],
  clickHandler = id => actions.reverseUrl({ id }),
}) => (
  <div className="ItemGrid">
    {items.map(pk => (
      <ConnectedGridItem clickAction={clickHandler(pk)} key={pk} pk={pk} />
    ))}
  </div>
)
export default connect(state => ({ items: selectors.getItemList(state) }))(
  PhotoGrid,
)
