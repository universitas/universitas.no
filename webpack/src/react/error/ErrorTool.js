import { connect } from 'react-redux'
import { Error, Clear } from 'components/Icons'
import { getErrors, clearError } from 'error/duck'
import { timestamp as formatTimestamp } from 'utils/modelUtils'

const errorToString = R.cond([
  [R.has('detail'), R.prop('detail')],
  [R.is(String), R.identity],
  [R.is(Object), JSON.stringify],
  [R.T, R.type],
])

const ErrorItem = ({ detail, timestamp, onClick }) => (
  <div className="ErrorItem">
    <span className="text">
      <div className="timestamp">{formatTimestamp(timestamp)}</div>
      <div className="detail">{detail}</div>
    </span>
    <span className="dismiss" onClick={onClick}><Clear /></span>
  </div>
)

const ErrorTool = ({ errors, clearError }, index) =>
  errors.length
    ? <div className="AppButton ErrorTool">
        <Error />
        <small>{errors.length} feil</small>
        <div className="errorItems">
          {errors.map(({ detail, timestamp }, index) => (
            <ErrorItem
              detail={detail}
              timestamp={timestamp}
              key={index}
              onClick={e => clearError(index)}
            />
          ))}
        </div>
      </div>
    : null

ErrorTool.propTypes = {
  errors: PropTypes.array.isRequired,
  clearError: PropTypes.func.isRequired,
}
export default connect(state => ({ errors: getErrors(state) }), { clearError })(
  ErrorTool
)
