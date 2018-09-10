import { connect } from 'react-redux'
import { ImageData } from 'components/photos'
import { modelSelectors } from 'ducks/basemodel'
import { changeDuplicate } from 'ducks/fileupload'
import { Tool } from 'components/tool'
import { toRoute } from 'prodsys/ducks/router'
import cx from 'classnames'

const getImage = modelSelectors('photos').getItem

const FlipFlop = ({ choices, changeHandler, value }) => (
  <div className="FlipFlop">
    {R.pipe(
      R.mapObjIndexed((val, key) => (
        <button
          key={key}
          className={cx('flipFlopChoice', { active: val == value })}
          onClick={changeHandler(val)}
        >
          {key}
        </button>
      )),
      R.values,
    )(choices)}
  </div>
)

const Duplicate = ({
  id,
  changeHandler,
  viewImage,
  choice,
  small,
  ...props
}) => (
  <div className="Duplicate">
    <ImageData {...props} thumb={small} onClick={viewImage(id)} />
    <FlipFlop
      choices={{ behold: 'keep', erstatt: 'replace' }}
      value={choice}
      changeHandler={changeHandler}
    />
  </div>
)

const mapStateToProps = (state, { id }) => getImage(id)(state)
const mapDispatchToProps = (dispatch, { pk, id }) => ({
  changeHandler: value => e => dispatch(changeDuplicate(pk, id, value)),
  viewImage: pk => e => dispatch(toRoute({ model: 'photos', pk })),
})
export default connect(mapStateToProps, mapDispatchToProps)(Duplicate)
