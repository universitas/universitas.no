import cx from 'classnames'
import { formatDate } from 'utils/text'

const PublicationTable = ({ year, issues = [] }) => (
  <table className={cx('PublicationTable', 'univTable')}>
    <thead>
      <tr className="IssueRow" key="issue_name">
        <th>Nummer</th>
        <th>Bilag</th>
        <th>Utgivelsesdato</th>
        <th>Reklamefrist</th>
      </tr>
    </thead>
    <tbody>
      {R.pipe(R.filter(R.propEq('year', year)), dataTransform, R.map(IssueRow))(
        issues,
      )}
    </tbody>
  </table>
)

const IssueRow = ({
  adDeadLine,
  publication_date,
  number,
  pdfs,
  issueType,
  issue_name,
  future,
}) => (
  <tr className={cx('IssueRow', future ? 'future' : 'past')} key={issue_name}>
    <td>{number}</td>
    <td>{issueType}</td>
    <td>{formatDate(publication_date, 'D. MMMM YYYY')}</td>
    <td>{formatDate(adDeadLine, 'D. MMMM YYYY')}</td>
  </tr>
)

const DAY = 1000 * 60 * 60 * 24 // milliseconds in a day
const ISSUE_TYPES = ['?', 'vanlig', 'magasin', 'velkomstbilag']

const dataTransform = R.pipe(
  R.sortBy(R.prop('publication_date')),
  R.map(
    R.converge(R.merge, [
      R.identity,
      ({ publication_date, issue_name, issue_type }) => ({
        adDeadLine: new Date(new Date(publication_date) - 2 * DAY),
        number: issue_name.split('/')[0],
        issueType: ISSUE_TYPES[issue_type],
        future: new Date(publication_date) > new Date(),
      }),
    ]),
  ),
)

export default PublicationTable
