import { connect } from 'react-redux'
import { Error, Clear } from 'components/Icons'
import { getErrors, clearError } from 'error/duck'

const errorToString = R.cond([
  [R.has('detail'), R.prop('detail')],
  [R.is(String), R.identity],
  [R.is(Object), JSON.stringify],
  [R.T, R.type],
])

const ErrorItem = ({ message, onClick }) => (
  <div className="ErrorItem">
    <span className="text">
      {errorToString(message)}
    </span>
    <span className="dismiss" onClick={onClick}>
      <Clear />
    </span>
  </div>
)

const ErrorTool = ({ errors, clearError }) =>
  errors.length
    ? <div className="AppButton ErrorTool">
        <Error />
        <small>{errors.length} feil</small>
        <div className="errorItems">
          {errors.map((err, index) => (
            <ErrorItem
              message={err}
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
