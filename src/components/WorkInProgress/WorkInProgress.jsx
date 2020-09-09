import React from 'react'
import logo from './developer-wip.png'
import PropTypes from 'prop-types'

const WorkInProgress = ({ dashboardName, fileName }) => {
  return (
    <div className='wip'>
      <header className='wip-header'>
        <img src={logo} className='wip-logo' alt='logo' />
        <h1 className='wip-title'>
          {dashboardName} dashboard is in work in progress
        </h1>
      </header>
      <p className='wip-intro'>
        To get started, edit <code>config/dashboards/{fileName}</code>
      </p>
    </div>
  )
}

WorkInProgress.propTypes = {
  dashboardName: PropTypes.string,
  fileName: PropTypes.string
}
export default WorkInProgress
