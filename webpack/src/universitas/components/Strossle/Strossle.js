const StrossleV1 = ({ id, url }) => (
  <div className="StrossleV1" data-spklw-widget={id} data-spklw-url={url} />
)

const StrossleV2 = ({ id, url }) => {
  const className = `strossle-widget-${id}`
  React.useEffect(
    () => {
      window.strossle && window.strossle(id, `.${className}`)
    },
    [url],
  )
  return <div className={className} />
}

const StrossleWidget = ({ v1 = false, ...props }) =>
  v1 ? <StrossleV1 {...props} /> : <StrossleV2 {...props} />

export default StrossleWidget
