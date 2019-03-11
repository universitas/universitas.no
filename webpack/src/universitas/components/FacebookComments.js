const FacebookComments = ({ id, url }) => {
  const element = React.useRef(null)
  React.useEffect(() => window.FB && window.FB.XFBML.parse(element.current), [
    url,
  ])
  return (
    <div
      className="fb-comments"
      data-href={url}
      data-numposts={10}
      data-width={'100%'}
      ref={element}
    />
  )
}

export default FacebookComments
