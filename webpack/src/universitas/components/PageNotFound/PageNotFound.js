import cx from 'classnames'
const PageNotFound = ({
  HTTPstatus,
  children = 'Fant ikke siden',
  className = '',
}) => (
  <article className={cx('PageNotFound', className)}>
    {HTTPstatus && <h1>HTTP {HTTPstatus}</h1>}
    {children}
  </article>
)

export default PageNotFound
