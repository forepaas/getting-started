import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Renders an hello-world
 */
class Hello extends Component {
  state = {}

  /**
   * render
   * @return {ReactElement} markup
   */
  render () {
    return (
      <div className='hello'>
        <img src='assets/img/logo.png' alt="logo" className='logo' />
        <h1>Welcome {this.props.name}</h1>
        <p>
          Welcome to your newly created Application
        </p>
      </div>
    )
  }
}

Hello.propTypes = {
  name: PropTypes.string
}

export default Hello
