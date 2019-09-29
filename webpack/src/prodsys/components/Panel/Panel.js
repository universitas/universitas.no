import SentryBoundary from 'common/components/SentryBoundary'
import cx from 'classnames'

const TopBar = ({ children }) => <nav className="TopBar">{children}</nav>
const BottomBar = ({ children }) => <nav className="BottomBar">{children}</nav>

const Panel = ({
  children,
  header = null,
  footer = null,
  className,
  scroll = true,
  ...props
}) => (
  <section className={cx('Panel', className)} {...props}>
    <SentryBoundary>
      {header && <TopBar>{header}</TopBar>}
      <SentryBoundary>
        <section className={cx('content', { scroll })}>{children}</section>
      </SentryBoundary>
      {footer && <BottomBar>{footer}</BottomBar>}
    </SentryBoundary>
  </section>
)
export default Panel
