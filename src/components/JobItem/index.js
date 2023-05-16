import './index.css'
import {AiFillStar, AiTwotoneMail} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {Link} from 'react-router-dom'

const JobItem = props => {
  const {jobDetails} = props
  const {
    title,
    companyLogoUrl,
    rating,
    jobDescription,
    employmentType,
    location,
    packagePerAnnum,
    id,
  } = jobDetails
  return (
    <Link to={`jobs/${id}`}>
      <li className="job-item-list-item">
        <div className="job-item-logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <h1 className="job-item-description-title">Description</h1>
        <p className="job-item-description-text">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobItem
