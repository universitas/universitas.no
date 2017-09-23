// Image Field

export const DetailField = ({ value, className, ...args }) => (
  <div
    style={{ border: '1px solid black', width: '100%' }}
    className={`${className} image`}
  >
    <img src={value} {...args} />
  </div>
)

export const EditableField = DetailField
