import React from 'react'
import jQuery from 'jquery'

export default class MenuCollapse extends React.Component {
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
    let iconClass = 'fa fa-bars'
    return (
      <div onClick={this.toggle} className='fp-menu-collapse'>
        <i className={iconClass} />
      </div>
    )
  }
}

MenuCollapse.propTypes = {
}
