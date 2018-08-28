import optionWrapper from './optionWrapper.js'
import anonymous from 'images/anonymous.jpg'

const Option = ({ id, name, thumb = anonymous, title = '' }) => (
  <div className="ContributorOption">
    <img className="thumb" src={thumb} />
    <span className="name">{name}</span>
    <span className="title">{title}</span>
  </div>
)

export const components = { Option: optionWrapper(Option) }

export const itemsToOptions = R.pipe(
  R.values,
  R.map(({ display_name, position = {}, ...props }) => ({
    name: display_name,
    title: position.title,
    ...props,
  })),
)
