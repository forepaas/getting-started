import React, { Component } from 'react'
import FpSdk from 'forepaas/sdk'

class DashboardTitle extends Component {
  get title() {
    return FpSdk.config.dashboarding[window.locationhash.split('?')[0].slice(1)].name
  }
  render() {
    return <div className='dashboard-title'>{this.title}</div>
  }
}

export default DashboardTitle
