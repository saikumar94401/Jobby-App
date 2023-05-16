import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome, AiTwotoneMail} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const removeAuthorization = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <ul className="home-nav-container">
      <Link to="/home">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="home-nav-website-logo"
        />
      </Link>

      <li className="nav-links-container">
        <Link className="nav-link" to="/">
          Home
        </Link>
        <Link className="nav-link" to="/jobs">
          Jobs
        </Link>
      </li>
      <li>
        <button
          type="button"
          className="home-nav-logout-button"
          onClick={removeAuthorization}
        >
          Logout
        </button>
      </li>

      <li className="home-nav-image-link-container">
        <Link className="nav-link" to="/">
          <AiFillHome className="nav-image-link" />
        </Link>
        <Link className="nav-link" to="/jobs">
          <AiTwotoneMail className="nav-image-link" />
        </Link>
        <FiLogOut className="nav-image-link" onClick={removeAuthorization} />
      </li>
    </ul>
  )
}

export default withRouter(Header)
