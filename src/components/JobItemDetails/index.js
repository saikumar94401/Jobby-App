import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiFillStar, AiTwotoneMail} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {GoLinkExternal} from 'react-icons/go'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const jobDetailsStatus = {
  initial: 'INITIAL',
  failure: 'FAILURE',
  success: 'SUCCESS',
  isLoading: 'PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    activeJobDetailsStatus: jobDetailsStatus.initial,
    jobItemDetails: {},
    similarJobs: [],
  }

  componentDidMount = () => {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({activeJobDetailsStatus: jobDetailsStatus.isLoading})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok === true) {
      this.setState({activeJobDetailsStatus: jobDetailsStatus.isLoading})
      const data = await response.json()

      const jobItemDetails = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
        lifeAtCompany: {
          description: data.job_details.life_at_company.description,
          imageUrl: data.job_details.life_at_company.image_url,
        },
        skills: data.job_details.skills.map(each => ({
          name: each.name,
          imageUrl: each.image_url,
        })),
      }
      console.log(data)
      const similarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        jobItemDetails,
        similarJobs,
        activeJobDetailsStatus: jobDetailsStatus.success,
      })
    } else {
      this.setState({activeJobDetailsStatus: jobDetailsStatus.failure})
    }
  }

  renderJobDetailsView = () => {
    const {jobItemDetails, similarJobs} = this.state
    const {
      title,
      rating,
      companyLogoUrl,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyWebsiteUrl,
      skills,
      lifeAtCompany,
    } = jobItemDetails

    console.log(title)
    return (
      <div className="job-item-details-container">
        <div className="job-item-details-content-container">
          <div className="job-item-logo-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-item-company-logo"
            />
            <div className="job-item-title-rating-container">
              <h1 className="job-item-title">{title}</h1>
              <div className="job-item-rating-container">
                <AiFillStar className="star-rating-icon" />
                <p className="job-item-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-item-location-internship-package-container">
            <div className="job-item-location-internship-container">
              <div className="job-item-location-container">
                <IoLocationSharp className="job-item-location-icon" />
                <p className="job-item-location">{location}</p>
              </div>
              <div className="job-item-location-container">
                <AiTwotoneMail className="job-item-location-icon" />
                <p className="job-item-location">{employmentType}</p>
              </div>
            </div>
            <p className="job-item-package">{packagePerAnnum} </p>
          </div>
          <hr className="hrs-line" />
          <div className="job-item-details-description-container">
            <div className="job-item-details-description-website-link-container">
              <h1 className="job-item-details-description-title">
                Description
              </h1>
              <a
                href={companyWebsiteUrl}
                className="job-item-details-website-link"
              >
                <p className="job-item-details-visit-text">Visit</p>
                <GoLinkExternal className="job-item-details-external-link" />
              </a>
            </div>

            <p className="job-item-details-description-text">
              {jobDescription}
            </p>
          </div>
          <div className="job-item-details-skills-container">
            <h1 className="job-item-details-skills-title">Skills</h1>

            <ul className="job-item-details-skills-list">
              {skills.map(eachSkill => {
                const {name, imageUrl} = eachSkill
                return (
                  <li key={name} className="job-item-details-skills-list-item">
                    <img
                      src={imageUrl}
                      alt={name}
                      className="job-item-details-skills-list-item-image"
                    />
                    <p className="job-item-details-skills-name">{name}</p>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="job-item-details-skills-life-at-company-container">
            <div className="job-item-details-skills-life-at-company-content-container">
              <h1 className="job-item-details-skills-life-at-company-content-title">
                Life at Company
              </h1>
              <p className="job-item-details-skills-life-at-company-description">
                {lifeAtCompany.description}
              </p>
            </div>
            <img
              className="job-item-details-skills-life-at-company-image"
              src={lifeAtCompany.imageUrl}
              alt={title}
            />
          </div>
        </div>
        <div className="similar-jobs-container">
          <h1 className="similar-jobs-title">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs.map(similarJob => (
              <SimilarJobs similarJob={similarJob} key={similarJob.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderJobDetailsFailureView = () => (
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
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  isLoadingContainer = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobDetailsOptions = () => {
    const {activeJobDetailsStatus} = this.state
    switch (activeJobDetailsStatus) {
      case jobDetailsStatus.success:
        return this.renderJobDetailsView()
      case jobDetailsStatus.isLoading:
        return this.isLoadingContainer()
      case jobDetailsStatus.failure:
        return this.renderJobDetailsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.jobDetailsOptions()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
