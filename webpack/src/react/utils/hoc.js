// (Component, str, Component?) -> render({fetching: bool, fetchData: fn, ...props})

export const requestData = (
  Wrapped,
  sentinel,
  Loader = () => null
) => props => {
  const { fetching, fetchData, ...data } = props
  const isReady = sentinel ? R.has(sentinel) : R.isEmpty
  if (isReady(data)) return <Wrapped {...props} />
  if (!fetching) fetchData()
  return <Loader {...props} />
}
