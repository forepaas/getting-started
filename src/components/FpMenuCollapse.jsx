import React from 'react'
import jQuery from 'jquery'

export default class FpMenuCollapse extends React.Component {
  constructor (props) {
    super(props)
    this.toggle = this.toggle.bind(this)
    this.state = {
      collapse: false
    }
  }

  toggle () {
    jQuery('body').toggleClass('collapse')
    this.setState({collapse: !this.state.collapse})
    window.dispatchEvent(new Event('resize'))
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'))
    }, 150)
  }

  render () {
    let iconClass = (this.state.collapse && 'fa fa-angle-right') || 'fa fa-angle-left'
    return (
      <div onClick={this.toggle} className='fp-menu-collapse'>
        <i className={iconClass} />
      </div>
    )
  }
}

FpMenuCollapse.propTypes = {
}
