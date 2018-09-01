// Integer field
export const DetailField = ({ value, ...args }) => (
  <span {...args}>{value ? 'ja' : 'nei'}</span>
)

export const EditableField = ({ value, onChange, ...args }) => (
  <input
    checked={value}
    onChange={e => onChange(e.target.checked)}
    {...args}
    type="checkbox"
  />
)
