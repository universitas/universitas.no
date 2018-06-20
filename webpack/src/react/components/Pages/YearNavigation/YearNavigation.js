import Link from 'redux-first-router-link'
import cx from 'classnames'

const YearLink = ({ issues = [], year, toUrl, className }) =>
  R.find(R.propEq('year', year), issues) ? (
    <Link className={cx('ok', className)} to={toUrl(year)}>
      {year}
    </Link>
  ) : (
    <span className={cx('empty', className)}>{year}</span>
  )

const YearNavigation = ({ year, ...props }) => (
  <nav className="YearNavigation">
    <YearLink year={year - 1} className="last year" {...props} />
    <span className="current year">{year}</span>
    <YearLink year={year + 1} className="next year" {...props} />
  </nav>
)

export default YearNavigation
