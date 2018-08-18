import Raven from 'raven-js'

const ravenTranslate = {
  title: 'Feilmelding',
  subtitle: 'Feilen er registrert. ',
  subtitle2: 'Hvis du vil hjelpe til, skriv noen ord om hva som utløste feilen',
  labelName: 'Navn',
  labelEmail: 'Epost',
  labelComments: 'Hva skjedde?',
  labelClose: 'Lukk',
  labelSubmit: 'Send',
  errorGeneric:
    'Det skjedde en feil (feilception) da jeg skulle sende feilmeldinga. Vennligst prøv en gang til',
  errorFormEntry: 'Noen felter var ikke riktig fylt ut.',
  successMessage: 'Tilbakemeldingen er sendt. Takk skal du ha!',
}

class RavenBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error })
    Raven.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="RavenBoundary"
          onClick={() =>
            Raven.lastEventId() && Raven.showReportDialog(ravenTranslate)}
        >
          <h1>Søren, heller!</h1>
          <p>Noe gikk galt</p>
          <p>
            Feilen har blitt logget, men du kan også klikke her for å legge inn
            en manuell feilmelding
          </p>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}

export default RavenBoundary
