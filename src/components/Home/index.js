import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'
import Header from '../Header'

class Home extends Component {
  //   changeToJobsPortal = () => {
  //     const {history} = this.props
  //     history.replace('/jobs')
  //   }

  render() {
    return (
      <div className="home-container">
        <Header />
        <div className="home-content-container">
          <div className="home-text-content-container">
            <h1 className="home-text-content-heading">
              Find The Job That Fits Your Life
            </h1>
            <p className="home-text-content-description">
              Millions of people are searching for jobs,salary information,
              company reviews. Find the jobs that fit your abilities and
              potential
            </p>
            <Link to="/jobs">
              <button
                type="button"
                className="home-text-jobs-button"
                // onClick={this.changeToJobsPortal}
              >
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
