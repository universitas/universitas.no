import { connect } from 'react-redux'
import { Error } from 'components/Icons'
import { logOut, logIn, getUser } from 'ducks/auth'
import urls from 'services/authurls'
import styled from 'styled-components'
import { useState } from 'react'

const LoginForm2 = ({ logIn, error }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    logIn(username, password)
  }

  return (
    <Container>
      <Title>Logg inn i prodsys</Title>
      <Input
        value={username}
        onChange={event => setUsername(event.target.value)}
        placeholder="brukernavn"
        type="text"
      />
      <Input
        value={password}
        onChange={event => setPassword(event.target.value)}
        placeholder="password"
        type="password"
      />
      <Button onClick={handleLogin}>Logg inn</Button>

      <Subtitle> eller </Subtitle>
      <OAuthLogin />
      <ForgotPassword />
      <RegisterNewUser />

      <ErrorContainer {...error} />
      </Container>
  )
}

const ErrorMessage = ({ children }) => (
  <div className="ErrorMessage">
    <span className="text">{children}</span>
  </div>
)

const OAuthLogin = () => {
  const Container = styled.a`
    color: white;
    background-color: #4267b2;

    border-radius: 4px;
    padding: 0.5rem 1rem;

    text-align: center;
    font-weight: 500;
    text-decoration: none;
  `

  return <Container href={urls.login.facebook}>Logg inn med Facebook</Container>
}

const ForgotPassword = () => {
  const Container = styled.a`
    font-family: 'Roboto', sans-serif;
    color: #2F2F2F;
    padding: 1rem;
  `
  return <Container href={urls.password.reset}>Glemt Passord?</Container>
}


const RegisterNewUser = () => {
  const Container = styled.a`
  font-family: 'Roboto', sans-serif;
  color: #2F2F2F;
  padding: 0.5rem;
  `
  return <Container href={urls.signup}> Registrer ny bruker </Container>
}



const ErrorContainer = ({ password, non_field_errors }) => {
  const Message = styled.p``
  return (
    <>
      {non_field_errors && <ErrorMessage>{non_field_errors}</ErrorMessage>}
      {password && <ErrorMessage>passord: {password}</ErrorMessage>}
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  background-color: #f0f0f0;
  min-height: 100vh;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  margin: auto;
  max-width: 700px;

  text-align: center;
  padding: 5%;

  background-color: white;
  border-radius: 8px;

  font-size: 1.3rem;
`

const Title = styled.h1`
  text-align: center;
  color: #2a2d33;
  font-family: 'Archivo Black', sans-serif;
  font-weight: 400;
  padding: 1rem;
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
`

const Subtitle = styled.p`
  color: gray;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
`

const Button = styled.button`
  margin-bottom: 0.5rem;
  width: 25rem;
  min-width: 5rem;
  font-size: 1em;
  font-family: 'Roboto', sans-serif;
  color: white;
  padding: 0.5rem;
  background: #DF4949;
  border-radius: 0.2em;
`

const Input = styled.input`
  margin-bottom: 0.5rem;
  width: 25rem;
  min-width: 5rem;
  font-size: 1em;
  font-family: 'Roboto', sans-serif;
  color: black;
  background: #F7F7F7;
  padding: 0.5rem;
  border-radius: 0.2em;
  border: 0.5px white;
`

export default connect(
  getUser,
  { logIn },
)(LoginForm2)
