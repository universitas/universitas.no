import { connect } from 'react-redux'
import { logOut, logIn, getUser } from 'ducks/auth'

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    const login = this.login.value
    const password = this.password.value
    console.log('login', login, password)
    this.props.logIn(login, password)
  }
  render() {
    const { non_field_errors } = this.props.error
    return (
      <form action="#" className="LoginForm" onSubmit={this.handleSubmit}>
        <h1>Logg inn i prodsys</h1>
        <input ref={el => (this.login = el)} type="text" placeholder="bruker" />
        <input
          ref={el => (this.password = el)}
          type="password"
          placeholder="passord"
        />
        <input className="button" type="submit" value="Logg inn" />
        {non_field_errors && <span>{non_field_errors}</span>}
        {this.props.error.password &&
          <span>passord: {this.props.error.password}</span>}
      </form>
    )
  }
}

LoginForm.propTypes = {
  pending: PropTypes.bool.isRequired,
  error: PropTypes.any,
  logIn: PropTypes.func.isRequired,
}
export default connect(getUser, { logIn })(LoginForm)
