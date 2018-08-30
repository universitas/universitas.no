export const reshape = ({ title, working_title, id, ...props }) => ({
  label: title || working_title,
  id,
  ...props,
})
