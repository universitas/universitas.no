// (Component, str, Component?) -> render({fetching: bool, fetchData: fn, ...props})

export const requestData = (
  Wrapped,
  sentinel,
  Loader = () => null
) => props => {
  const ready = sentinel ? R.has(sentinel, props) : R.isEmpty(props)
  if (ready) return <Wrapped {...props} />
  props.fetching || props.fetchData()
  return <Loader {...props} />
}
