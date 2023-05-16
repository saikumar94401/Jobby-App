import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import './index.css'
import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const profileStatus = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  isLoading: 'PROGRESS',
}
const jobStatus = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  isLoading: 'PROGRESS',
}

class Jobs extends Component {
  state = {
    activeProfileStatus: profileStatus.initial,
    activeJobStatus: jobStatus.initial,
    profileDetails: {},
    jobDetails: [],
    searchText: '',
    employmentType: [],
    salaryRange: '',
  }

  updateSearchText = event => {
    this.setState({searchText: event.target.value})
  }

  updateKeyDown = event => {
    if (event.key === 'Enter') {
      this.getJobData()
    }
  }

  componentDidMount = () => {
    this.getProfileData()
    this.getJobData()
  }

  getJobData = async () => {
    const {searchText, salaryRange, employmentType} = this.state
    console.log(salaryRange, searchText, employmentType)
    const jwtToken = Cookies.get('jwt_token')
    this.setState({activeJobStatus: jobStatus.isLoading})
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${salaryRange}&search=${searchText}`,
      options,
    )
    console.log(response)
    if (response.ok === true) {
      this.setState({activeJobStatus: jobStatus.success})
      const data = await response.json()

      const updatedData = data.jobs.map(each => ({
        title: each.title,
        companyLogoUrl: each.company_logo_url,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        employmentType: each.employment_type,
      }))

      this.setState({jobDetails: updatedData})
    } else {
      this.setState({activeJobStatus: jobStatus.failure})
    }
  }

  getProfileData = async () => {
    const jwtToken = Cookies.get('jwt_token')
    this.setState({activeProfileStatus: profileStatus.isLoading})
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)

    if (response.ok === true) {
      this.setState({activeProfileStatus: profileStatus.success})
      const data = await response.json()

      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileDetails: updatedData})
    } else {
      this.setState({activeProfileStatus: profileStatus.failure})
    }
  }

  profileStatusContent = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="jobs-profile-container">
        <img
          src={profileImageUrl}
          alt="profile"
          className="job-profile-image"
        />
        <h1 className="job-profile-heading">{name}</h1>
        <p className="job-profile-bio">{shortBio}</p>
      </div>
    )
  }

  isLoadingContainer = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileFailureView = () => (
    <div className="profile-failure-container">
      <button
        className="failure-retry-button"
        type="button"
        onClick={this.getProfileData}
      >
        Retry
      </button>
    </div>
  )

  jobFailureView = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-failure-image"
      />
      <h1 className="job-failure-title">Oops! Something Went Wrong</h1>
      <p className="job-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-retry-button failure-retry-button-additional"
        type="button"
        onClick={this.getJobData}
      >
        Retry
      </button>
    </div>
  )

  jobStatusContent = () => {
    const {jobDetails} = this.state
    const noJobRoute = () => (
      <div className="job-failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="job-failure-image"
        />
        <h1 className="job-failure-title">No Jobs Found</h1>
        <p className="job-failure-description">
          We could not find any jobs.Try others filters.
        </p>
      </div>
    )
    return (
      <ul className="job-item-container">
        {jobDetails.length === 0 ? (
          noJobRoute()
        ) : (
          <ul className="job-item-each-job-list">
            {jobDetails.map(each => (
              <JobItem jobDetails={each} key={each.id} />
            ))}
          </ul>
        )}
      </ul>
    )
  }

  profileOptions = () => {
    const {activeProfileStatus} = this.state
    switch (activeProfileStatus) {
      case profileStatus.success:
        return this.profileStatusContent()
      case profileStatus.isLoading:
        return this.isLoadingContainer()
      case profileStatus.failure:
        return this.profileFailureView()
      default:
        return null
    }
  }

  jobOptions = () => {
    const {activeJobStatus} = this.state
    switch (activeJobStatus) {
      case jobStatus.success:
        return this.jobStatusContent()
      case jobStatus.isLoading:
        return this.isLoadingContainer()
      case jobStatus.failure:
        return this.jobFailureView()
      default:
        return null
    }
  }

  updateRadioButton = event => {
    this.setState({salaryRange: event.target.value}, this.getJobData)
  }

  filterGroup = () => {
    const updateCheckbox = event => {
      this.setState(
        prev => ({
          employmentType: [...prev.employmentType, event.target.value],
        }),
        this.getJobData,
      )
    }

    return (
      <>
        <div className="types-of-employment-container">
          <p className="types-of-employment-title">Type of Employment</p>
          <ul className="employment-list">
            {employmentTypesList.map(each => {
              const {label, employmentTypeId} = each
              return (
                <li key={employmentTypeId}>
                  <input
                    type="checkbox"
                    id={employmentTypeId}
                    className="employment-checkbox"
                    onChange={updateCheckbox}
                    value={employmentTypeId}
                  />
                  <label
                    className="label-employment"
                    htmlFor={employmentTypeId}
                  >
                    {label}
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
        <hr className="hr-line" />
        <div className="types-of-employment-container">
          <p className="types-of-employment-title">Salary Range</p>
          <ul className="employment-list">
            {salaryRangesList.map(each => {
              const {label, salaryRangeId} = each
              return (
                <li key={salaryRangeId}>
                  <input
                    type="radio"
                    id={salaryRangeId}
                    className="employment-checkbox"
                    value={salaryRangeId}
                    name="salary"
                    onChange={this.updateRadioButton}
                  />
                  <label className="label-employment" htmlFor={salaryRangeId}>
                    {label}
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      </>
    )
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-profile-search-container">
            {this.profileOptions()}
            <hr className="hr-line" />
            {this.filterGroup()}
          </div>
          <div className="jobs-input-results-container">
            <div className="input-search-container">
              <input
                type="search"
                className="input-search"
                placeholder="Search"
                onChange={this.updateSearchText}
                onKeyDown={this.updateKeyDown}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.getJobData}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.jobOptions()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
