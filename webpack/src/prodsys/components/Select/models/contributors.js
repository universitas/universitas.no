import optionWrapper from './optionWrapper.js'
import anonymous from 'images/anonymous.png'
import Debug from 'components/Debug'

const Option = ({ id, name, label, thumb, title = 'opprett ny...' }) => (
  <div className="ContributorOption">
    <img className="thumb" src={thumb || anonymous} />
    <span className="name">{name ? name : `"${label}"`}</span>
    <span className="title">{title}</span>
  </div>
)
export const reshape = props => ({
  value: `${props.id}`,
  name: props.display_name,
  label: props.display_name,
  ...props,
})

export const create = value => ({
  display_name: value,
  status: 3, // external
})

export const components = { Option: optionWrapper(Option) }
