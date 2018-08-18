import { connect } from 'react-redux'
import cx from 'classnames'
import { Helmet } from 'react-helmet'
import { requestData } from 'utils/hoc'

import { toPubSchedule } from 'ducks/router'
import { getIssues, issuesRequested } from 'ducks/issues'
import YearNavigation from './YearNavigation'
import PublicationTable from './PublicationTable'
import LoadingIndicator from 'components/LoadingIndicator'

const currentYear = new Date().getFullYear()

const PublicationSchedule = ({
  pageTitle,
  issues,
  year = currentYear,
  className,
}) => (
  <article className={cx('PublicationSchedule', className)}>
    <YearNavigation year={year} issues={issues} toUrl={toPubSchedule} />
    <h1>{pageTitle}</h1>
    <p>Magasin er Universitas' månedlige featurebilag</p>
    <p>
      Velkomstbilaget Universitas' årlige velkomstmagasin for nye og gamle
      studenter. Det samme bilaget legges ved i avisenes to første utgaver
    </p>
    <PublicationTable year={year} issues={issues} />
  </article>
)

export default connect(getIssues, { fetchData: issuesRequested })(
  requestData(PublicationSchedule, 'issues', LoadingIndicator),
)
