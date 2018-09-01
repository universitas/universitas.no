// Range Field

export const DetailField = ({ value, ...args }) => (
  <span {...args}>{value}</span>
)
export const EditableField = ({ value, onChange, ...args }) => (
  <React.Fragment>
    <input type="range" value={value} {...args} onChange={onChange} />
    <span
      onClick={e => onChange(0)}
      style={{ width: '2rem', textAlign: 'center' }}
    >
      {value}
    </span>
  </React.Fragment>
)
