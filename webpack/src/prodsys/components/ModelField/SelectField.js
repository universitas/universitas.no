// Select Field using AutoSelect
import Select from 'components/Select'
import Debug from 'components/Debug'
import { modelActions, modelSelectors } from 'ducks/basemodel'

export const DetailField = ({ value, to, options, ...props }) => (
  <span {...props}>
    <Select value={value} model={to} options={options} noneditable />
  </span>
)
export const EditableField = ({
  value,
  to,
  onChange,
  filter,
  options,
  required = true,
  creatable = false,
  ...props
}) => (
  <span {...props}>
    <Select
      filter={filter}
      value={value}
      options={options}
      model={to}
      isClearable={!required}
      onChange={onChange}
      creatable={creatable}
    />
  </span>
)
