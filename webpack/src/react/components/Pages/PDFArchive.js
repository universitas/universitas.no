import { connect } from 'react-redux'
import { getIssues, issuesRequested } from 'ducks/issues'
import { toPdf } from 'ducks/router'
import { requestData } from 'utils/hoc'

import LoadingIndicator from 'components/LoadingIndicator'
import PdfList from './PdfList'
import YearNavigation from './YearNavigation'

const currentYear = new Date().getFullYear()

const PDFArchive = ({ pageTitle, issues, year = currentYear }) => (
  <div className="PDFArchive">
    <YearNavigation issues={issues} year={year} toUrl={toPdf} />
    <h1>{pageTitle}</h1>
    <PdfList issues={R.filter(R.propEq('year', year), issues)} />
  </div>
)

export default connect(getIssues, { fetchData: issuesRequested })(
  requestData(PDFArchive, 'issues', LoadingIndicator),
)
