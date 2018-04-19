import { connect } from 'react-redux'
import StaticImageData from './ImageData'
import { modelSelectors } from 'ducks/basemodel'
import { changeDuplicate } from 'ducks/fileupload'
import Tool from 'components/Tool'

const getImage = modelSelectors('images').getItem

const Duplicate = ({
  pk,
  keepDuplicate,
  replaceDuplicate,
  choice,
  id,
  ...props
}) => (
  <div className="Duplicate">
    <StaticImageData {...props} />
    <small>{`${choice}`}</small>
    <div className="buttons" style={{ flexDirection: 'row' }}>
      <Tool icon="check" onClick={replaceDuplicate} label="erstatt" />
      <Tool icon="replace" onClick={keepDuplicate} label="behold" />
    </div>
  </div>
)

const convertProps = ({
  size = [0, 0],
  stat = {},
  name = '',
  small,
  created,
  ...props
}) => ({
  ...props,
  width: size[0],
  height: size[1],
  size: stat.size,
  stat: stat,
  mimetype: R.test(/jpg/, name) ? 'image/jpeg' : 'image/png',
  thumb: small,
  date: created,
})

const mapStateToProps = (state, { id }) => convertProps(getImage(id)(state))
const mapDispatchToProps = (dispatch, { pk, id }) => ({
  keepDuplicate: e => dispatch(changeDuplicate(pk, id, 'keep')),
  replaceDuplicate: e => dispatch(changeDuplicate(pk, id, 'replace')),
})
export default connect(mapStateToProps, mapDispatchToProps)(Duplicate)
