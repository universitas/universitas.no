import xSvg from 'images/x.svg'
import chevronSvg from 'images/chevron.svg'
import Throbber from 'components/Throbber'

export const DropdownIndicator = ({ innerProps }) => (
  <img className="react-select__indicator" src={chevronSvg} {...innerProps} />
)
export const ClearIndicator = ({ innerProps }) => (
  <img className="react-select__indicator" src={xSvg} {...innerProps} />
)
export const LoadingIndicator = ({ innerProps }) => (
  <span className="react-select__loading-indicator" {...innerProps}>
    <Throbber />
  </span>
)
