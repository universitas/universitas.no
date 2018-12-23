export const reshape = ({ title, ...props }) => ({
  label: title,
  ...props,
})

export const reshapeOptions = R.pipe(
  R.groupBy(R.prop('is_management')),
  obj => ({ mellomleder: obj.true, redaksjonsmedlem: obj.false }),
  R.toPairs,
  R.reverse,
  R.map(([label, options]) => ({ label, options })),
)
