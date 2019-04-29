import { connect } from 'react-redux'
import cx from 'classnames'
import { Helmet } from 'react-helmet'
import { requestData } from 'utils/hoc'

import { toPubSchedule } from 'universitas/ducks/router'
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
    <YearNavigation
      year={parseInt(year)}
      issues={issues}
      toUrl={toPubSchedule}
    />
    <h1>{pageTitle}</h1>
    <PublicationTable year={parseInt(year)} issues={issues} />
    <p>
      <strong>Magasin</strong> er Universitas' featurebilag.
    </p>
    <p>
      <strong>Velkomstbilaget</strong> er Universitas' årlige velkomstmagasin
      for nye og gamle studenter. Bilaget legges ved i avisens første utgave i
      august.
    </p>
  </article>
)

export default connect(
  getIssues,
  { fetchData: issuesRequested },
)(requestData(PublicationSchedule, 'issues', LoadingIndicator))
