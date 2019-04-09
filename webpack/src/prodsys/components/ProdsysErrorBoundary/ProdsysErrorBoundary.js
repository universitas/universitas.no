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

class ProdsysErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      error: null,
      production: process.env.NODE_ENV == 'production',
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error })
    console.error('error caught', process.env.NODE_ENV)
    if (this.state.production)
      Raven.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.error) {
      if (this.state.production) {
        return (
          <div
            className="ProdsysErrorBoundary"
            onClick={() =>
              Raven.lastEventId() && Raven.showReportDialog(ravenTranslate)
            }
          >
            <h1>Søren, heller!</h1>
            <p>Noe gikk galt</p>
            <p>
              Feilen har blitt logget, men du kan også klikke her for å legge
              inn en manuell feilmelding
            </p>
          </div>
        )
      } else {
        return (
          <div className="ProdsysErrorBoundary">
            <h1>Error</h1>
            <pre
              style={{
                whiteSpace: 'pre-wrap',
                fontSize: '12px',
              }}
            >{`${this.state.error.stack}`}</pre>
          </div>
        )
      }
    } else {
      return this.props.children
    }
  }
}

export default ProdsysErrorBoundary
