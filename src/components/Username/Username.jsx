import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import FpClientAuthorityManager from 'forepaas/client-authority-manager'

@connect((state) => ({
  local: state.local
}))

/**
 * Renders the current logged username with picture
 */
class Username extends Component {
  state = {}

  get username() {
    if (this.props.local && this.props.local['client-authority-manager-session']) {
      return `${this.props.local['client-authority-manager-session'].firstname} ${this.props.local['client-authority-manager-session'].lastname}`
    }
    return 'Not connected'
  }

  logout = (e) => {
    FpClientAuthorityManager.FpAuthentication.logout()
  }

  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    return (
      <div className='username'>
        <div className='username-content'>
          <div className='username-info'>
            <p className='username-name'>{this.username}</p>
            <p className='username-logout' onClick={this.logout}>Logout</p>
          </div>
        </div>
      </div>
    )
  }
}

Username.propTypes = {
  local: PropTypes.object
}

export default Username
