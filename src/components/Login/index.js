import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', error: false}

  changeUsername = event => {
    this.setState({username: event.target.value})
  }

  changePassword = event => {
    this.setState({password: event.target.value})
  }

  successResponse = jwtToken => {
    console.log(jwtToken)
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  failureResponse = errorMsg => {
    console.log(errorMsg)
    this.setState({error: true, errorMsg})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userData = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userData),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.successResponse(data.jwt_token)
    } else {
      this.failureResponse(data.error_msg)
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      return <Redirect to="/" />
    }
    const {username, password, error, errorMsg} = this.state
    return (
      <div className="login-container">
        <div className="user-credentials-container">
          <img
            className="website-logo"
            alt="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          />
          <form onSubmit={this.submitForm} className="login-form-container">
            <div className="input-label-container">
              <label htmlFor="username" className="login-label">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="login-input"
                placeholder="Username"
                onChange={this.changeUsername}
                value={username}
              />
            </div>

            <div className="input-label-container">
              <label htmlFor="password" className="login-label">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="login-input"
                placeholder="Password"
                onChange={this.changePassword}
                value={password}
              />
            </div>
            <button className="login-button" type="submit">
              Login
            </button>
            {error && <p className="login-error-msg">*{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
