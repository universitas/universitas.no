import { connect } from 'react-redux'
import { logOut, logIn, getUser } from 'auth/duck'

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    const login = this.login.value
    const password = this.password.value
    console.log('login', login, password)
    this.props.logIn(login, password)
  }
  render() {
    return (
      <form action="#" className="LoginForm" onSubmit={this.handleSubmit}>
        <input ref={el => (this.login = el)} type="text" placeholder="bruker" />
        <input
          ref={el => (this.password = el)}
          type="password"
          placeholder="passord"
        />
        <input className="button" type="submit" value="Logg inn" />
      </form>
    )
  }
}

LoginForm.propTypes = {
  pending: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired,
}
export default connect(getUser, { logIn })(LoginForm)
