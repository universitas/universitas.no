import { connect } from 'react-redux'
import { Error } from 'components/Icons'
import { logOut, logIn, getUser } from 'ducks/auth'
import urls from 'utils/urls'

const ErrorMessage = ({ children }) => (
  <div className="ErrorMessage">
    <span className="text">{children}</span>
  </div>
)

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    const login = this.login.value
    const password = this.password.value
    this.props.logIn(login, password)
  }
  render() {
    const { non_field_errors, password } = this.props.error
    return (
      <form action="#" className="LoginForm" onSubmit={this.handleSubmit}>
        <h1>Logg inn i prodsys</h1>
        <input
          ref={el => (this.login = el)}
          type="text"
          placeholder="brukernavn eller epost"
        />
        <input
          ref={el => (this.password = el)}
          type="password"
          placeholder="passord"
        />
        <input className="button" type="submit" value="Logg inn" />
        <a className="text" href={urls.password.reset}>Glemt passord?</a>
        <a className="text" href={urls.login.facebook}>logg inn med Facebook</a>
        {non_field_errors && <ErrorMessage>{non_field_errors}</ErrorMessage>}
        {password && <ErrorMessage>passord: {password}</ErrorMessage>}
      </form>
    )
  }
}

LoginForm.propTypes = {
  error: PropTypes.any,
  logIn: PropTypes.func.isRequired,
}
export default connect(getUser, { logIn })(LoginForm)
