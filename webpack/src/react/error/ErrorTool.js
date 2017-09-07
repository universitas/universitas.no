import { connect } from 'react-redux'
import { Error } from 'components/Icons'
import { getErrors, clearError } from 'error/duck'

const ErrorItem = ({ message, onClick }) => (
  <div onClick={onClick} className="ErrorItem">{JSON.stringify(message)}</div>
)

const ErrorTool = ({ errors, clearError }) =>
  errors.length
    ? <div className="ErrorTool">
        <Error />
        {errors.map((err, index) => (
          <ErrorItem
            message={err}
            key={index}
            onClick={e => clearError(index)}
          />
        ))}
      </div>
    : null

ErrorTool.propTypes = {
  errors: PropTypes.array.isRequired,
  clearError: PropTypes.func.isRequired,
}
export default connect(state => ({ errors: getErrors(state) }), { clearError })(
  ErrorTool
)
