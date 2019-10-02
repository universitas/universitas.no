import * as Sentry from '@sentry/browser'

const translation = {
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

const TraceBack = ({ stack }) => {
  return (
    <pre
      style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}
      className="TraceBack"
    >
      {stack}
    </pre>
  )
}
class SentryBoundary extends React.Component {
  state = {
    eventId: null,
    stack: null,
    production: process.env.NODE_ENV === 'production',
  }

  componentDidCatch(error, errorInfo) {
    const setState = this.setState.bind(this)
    Sentry.withScope(function(scope) {
      scope.setExtras(errorInfo)
      const eventId = Sentry.captureException(error)
      setState({ eventId, stack: `${error.stack}` })
    })
  }
  // static getDerivedStateFromError(error) {
  //   const stack = `${error.stack}`
  //   return { stack }
  // }

  render() {
    const { stack, eventId } = this.state
    if (stack) {
      const reportDialog = ev => {
        Sentry.showReportDialog({ eventId, ...translation })
      }
      return (
        <div className="SentryBoundary">
          <h1>Søren, heller!</h1>
          {this.production ? <p>Noe gikk galt</p> : <TraceBack stack={stack} />}
          {eventId && (
            <p>
              Feilen har blitt logget, men du kan også klikke "send melding" for
              å legge inn en manuell feilmelding
              <button onClick={reportDialog}>send melding</button>
            </p>
          )}
          <button onClick={() => this.setState({ stack: null, eventId: null })}>
            prøv igjen
          </button>
        </div>
      )
    } else {
      return this.props.children
    }
  }
}

export default SentryBoundary
