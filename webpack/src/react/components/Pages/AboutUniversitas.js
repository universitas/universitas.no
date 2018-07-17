import { connect } from 'react-redux'
import { formatDate } from 'utils/text'
import Link from 'redux-first-router-link'
import { toAdInfo, toPubSchedule } from 'ducks/router'
import { Velferdstinget } from 'components/Logos'
import LoadingIndicator from 'components/LoadingIndicator'
import { requestData } from 'utils/hoc'
import { getSite, siteRequested } from 'ducks/site'
import Debug from 'components/Debug'
import ContactCard from 'components/ContactCard'
import cx from 'classnames'

const style = {
  lineHeight: 0,
  margin: '0 0 0 1rem',
  fontSize: '10rem',
  float: 'right',
}

const SiO = ({}) => (
  <a
    className="Velferdstinget"
    style={style}
    href="http://www.studentvelferd.no/"
  >
    <Velferdstinget />
  </a>
)

const NextIssue = ({ publication_date, issue_name }) => (
  <p className="NextIssue">
    Neste avis er nr {issue_name} og kommer ut{' '}
    {formatDate(publication_date, 'dddd D. MMMM')}.
  </p>
)

const AboutUniversitas = ({ pageTitle, issues, staff, className = '' }) => (
  <article className={cx('AboutUniversitas', className)}>
    <h1>{pageTitle}</h1>
    <p>Universitas er Norges største studentavis.</p>
    <p>Avisen har et opplag på 14 000, og kommer ut 35 ganger i året.</p>
    <SiO />
    <p>
      Universitas mottar støtte fra Studentsamskipnaden i Oslo og Akershus
      (SiO), og alle studenter som betaler semesteravgift er dermed med på å
      støtte Universitas økonomisk. Papirutgaven av Universitas distribueres
      rundt på læresteder tilknyttet SiO.
    </p>
    <p>
      Velferdstinget i Oslo og Akershus fordeler semesteravgiften, men står uten
      redaksjonelt ansvar.
    </p>
    <p>
      Universitas legges også ut ved studentbyene under SiO. Redaksjonen består
      av fire heltidsansatte og en rekke journalister, fotografer, sideuttegnere
      etc. som jobber frilans.
    </p>
    <p>
      Våre redaksjonslokaler finner du i andre etasje i Eilert Sunds barnehage,
      Moltke Moes vei 33.
    </p>
    <p>
      Vil du abonnere og få Universitas hjem til deg eller til din arbeidsplass,
      ta kontakt med daglig leder Simen Eriksen på tlf. 907 69 866, eller se
      under for andre måter å komme i kontakt.
    </p>
    <h3>Generell kontaktinfo</h3>
    <p>
      Telefon: 907 69 866 Faks: 22 85 32 74 Postadresse: Boks 89 Blindern, 0314
      Oslo Besøksadresse: Moltke Moes vei 33
    </p>
    <h3>Utgivelsesplan</h3>
    <NextIssue {...issues.next} />
    <p>
      <Link to={toPubSchedule()}>Se hele planen.</Link>
    </p>
    <h3>Annonsering</h3>
    <p>
      Kontakt Geir Dorp på mail{' '}
      <a href="mailto:geirdo@universitas.no">geirdo@universitas.no</a> tlf: 916
      64 496, eller <Link to={toAdInfo()}>les mer om annonsering.</Link>
    </p>
    <h3>Redaksjonen</h3>
    {R.map(props => <ContactCard key={props.id} {...props} />, staff)}
  </article>
)

const mapStateToProps = getSite
const mapDispatchToProps = { fetchData: siteRequested }
export default connect(mapStateToProps, mapDispatchToProps)(
  requestData(AboutUniversitas, 'staff'),
)
