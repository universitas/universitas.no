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

const TraceBack = ({ error }) => (
  <pre
    style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}
    className="TraceBack"
  >{`${error.stack}`}</pre>
)

class RavenBoundary extends React.Component {
  state = {
    production: process.env.NODE_ENV === 'production',
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error })
    Raven.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.error) {
      const ravenEvent = Raven.lastEventId()
      const reportDialog = () => Raven.showReportDialog(ravenTranslate)
      return (
        <div className="RavenBoundary">
          <h1>Søren, heller!</h1>
          {this.production ? (
            <p>Noe gikk galt</p>
          ) : (
            <TraceBack error={this.state.error} />
          )}
          {ravenEvent && (
            <p>
              Feilen har blitt logget, men du kan også klikke "send melding" for
              å legge inn en manuell feilmelding
              <button onClick={reportDialog}>send melding</button>
            </p>
          )}
          <button onClick={() => this.setState({ error: null })}>
            prøv igjen
          </button>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}

export default RavenBoundary
