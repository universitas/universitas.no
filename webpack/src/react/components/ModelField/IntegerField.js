// Choice field
export const DetailField = ({ choices, value, editable, ...args }) => (
  <span {...args}>{value}</span>
)

export const EditableField = ({ choices, value, editable, ...args }) => (
  <select value={value} {...args}>
    {choices.map(({ value, display_name }) => (
      <option key={value} value={value}> {display_name} </option>
    ))}
  </select>
)
