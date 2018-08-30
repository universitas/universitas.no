import optionWrapper from './optionWrapper.js'
import anonymous from 'images/anonymous.png'

const Option = ({ id, name, display_name, thumb, title = '' }) => (
  <div className="ContributorOption">
    <img className="thumb" src={thumb || anonymous} />
    <span className="name">{name || display_name || 'N. N.'}</span>
    <span className="title">{title || 'person'}</span>
  </div>
)

export const components = { Option: optionWrapper(Option) }
