import { connect } from 'react-redux'
import { getIssues, issuesRequested } from 'ducks/issues'
import { toPdf } from 'universitas/ducks/router'
import { requestData } from 'utils/hoc'
import cx from 'classnames'

import LoadingIndicator from 'components/LoadingIndicator'
import PdfList from './PdfList'
import YearNavigation from './YearNavigation'

const currentYear = new Date().getFullYear()

const PDFArchive = ({
  pageTitle,
  issues,
  className = '',
  year = currentYear,
}) => (
  <article className={cx('PDFArchive', className)}>
    <YearNavigation issues={issues} year={parseInt(year)} toUrl={toPdf} />
    <h1>{pageTitle}</h1>
    <PdfList issues={R.filter(R.propEq('year', parseInt(year)), issues)} />
  </article>
)

export default connect(
  getIssues,
  { fetchData: issuesRequested },
)(requestData(PDFArchive, 'issues', LoadingIndicator))
