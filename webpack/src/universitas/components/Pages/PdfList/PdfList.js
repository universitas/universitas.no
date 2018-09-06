import { formatDate } from 'utils/text'
import cx from 'classnames'

const filename = R.replace(/.*\//, '')

const Faximile = ({ cover, pages, pdf }) => (
  <div className="Faximile" key={cover}>
    <a href={pdf}>
      <img alt={filename(pdf)} src={cover} />
    </a>
  </div>
)

const sortPdfs = R.propSatisfies(R.test(/_mag/), 'pdf')

const Issue = ({ publication_date, issue_name, pdfs }) => (
  <div className={cx('Issue', { two: pdfs.length == 2 })} key={issue_name}>
    <div className="text">
      <div className="name">{issue_name}</div>
      <div className="date">{formatDate(publication_date, 'dddd D. MMMM')}</div>
    </div>
    <div className="pdf">
      {R.pipe(R.sortBy(sortPdfs), R.map(Faximile))(pdfs)}
    </div>
  </div>
)

const PdfList = ({ issues = [] }) => (
  <section className="PdfList">
    {R.pipe(
      R.filter(R.propSatisfies(R.length, 'pdfs')),
      R.sortBy(R.prop('publication_date')),
      R.reverse,
      R.map(Issue),
    )(issues)}
  </section>
)

export default PdfList
