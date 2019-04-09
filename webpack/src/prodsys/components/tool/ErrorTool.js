import { connect } from 'react-redux'
import { Error, Clear } from 'components/Icons'
import { getErrors, clearError, clearErrors } from 'ducks/error'
import { timestamp as formatTimestamp } from 'utils/modelUtils'

const errorToString = R.cond([
  [R.is(String), R.identity],
  [R.has('detail'), R.prop('detail')],
  [
    R.has('non_field_errors'),
    R.compose(
      R.join(', '),
      R.prop('non_field_errors'),
    ),
  ],
  [R.is(Object), JSON.stringify],
  [R.T, R.type],
])

const ErrorItem = ({ error, onClick }) => (
  <div className="ErrorItem" title={JSON.stringify(error, null, 2)}>
    <span className="text">
      <div className="timestamp">{formatTimestamp(error.timestamp)}</div>
      <div className="detail">{errorToString(error)}</div>
    </span>
    <span className="dismiss" onClick={onClick}>
      <Clear />
    </span>
  </div>
)

const ErrorTool = ({ errors, clearError, clearErrors }, index) =>
  errors.length ? (
    <div onClick={clearErrors} className="AppButton ErrorTool">
      <small>{errors.length} feil</small>
      <Error />
      <div className="errorItems">
        {errors.map((error, index) => (
          <ErrorItem
            key={index}
            error={error}
            onClick={e => clearError(index)}
          />
        ))}
      </div>
    </div>
  ) : null

export default connect(
  state => ({ errors: getErrors(state) }),
  {
    clearErrors,
    clearError,
  },
)(ErrorTool)
