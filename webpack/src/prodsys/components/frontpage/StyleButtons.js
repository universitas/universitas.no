import cx from 'classnames'
import './StyleButton.scss'
import { actions, selectors } from './model.js'
import { connect } from 'react-redux'
import {
  SideBySide,
  ImageAboveText,
  TextOnImage,
  BoldWeight,
  NormalWeight,
  ThinWeight,
  SmallText,
  MediumText,
  LargeText,
} from './Icons'
import {
  parseStyles,
  renderStyles,
} from 'components/NewsFeed/feedItemStyles.js'

const buttons = {
  size: {
    small: SmallText,
    medium: MediumText,
    large: LargeText,
  },
  bg: {
    white: SmallText,
    section: SmallText,
    black: SmallText,
  },
  weight: {
    bold: BoldWeight,
    thin: ThinWeight,
  },
  layout: {
    top: ImageAboveText,
    left: SideBySide,
    behind: TextOnImage,
  },
}

const mapObj = fn => R.compose(R.values, R.mapObjIndexed(fn))

export const StyleButtons = ({ value = '', onChange }) => {
  const styles = parseStyles(renderStyles(parseStyles(value)))
  const renderButtons = row =>
    mapObj((Icon, val) => {
      const active = styles[row] == val
      const onClick = e => onChange(renderStyles({ ...styles, [row]: val }))

      return (
        <div
          title={val}
          key={val}
          className={cx('option', `${row}--${val}`, { active })}
          onClick={onClick}
        >
          <Icon />
        </div>
      )
    })
  return (
    <div className="StyleButtons">
      {mapObj((options, row) => (
        <div key={row} className="optionGroup">
          {renderButtons(row)(options)}
        </div>
      ))(buttons)}
    </div>
  )
}

const mapStateToProps = (state, { pk, name = 'html_class' }) => ({
  value: selectors.getItem(pk)(state)[name],
})
const mapDispatchToProps = (dispatch, { pk, name = 'html_class' }) => ({
  onChange: value => dispatch(actions.fieldChanged(pk, name, value)),
})
export default connect(mapStateToProps, mapDispatchToProps)(StyleButtons)
