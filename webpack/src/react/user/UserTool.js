import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { logOut, logIn, getUser } from 'user/duck'

class LoginForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault()
    const login = this.login.value
    const password = this.password.value
    console.log('login', login, password)
    this.props.onSubmit(login, password)
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

const User = ({ name, logOut }) => (
  <div className="User">
    <span className="username">{name}</span>
    <button className="button" onClick={logOut}>Logg ut</button>
  </div>
)

const UserTool = ({ username, pending, logIn, logOut }) => (
  <div className="UserTool">
    {username
      ? <User name={username} logOut={logOut} />
      : <LoginForm onSubmit={logIn} />}
  </div>
)
UserTool.propTypes = {
  username: PropTypes.string,
  pending: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired,
  logOut: PropTypes.func.isRequired,
}
export default connect(getUser, { logIn, logOut })(UserTool)
