import React, { Component } from 'react'

import FpTranslate from 'forepaas/translate'

/**
 * Renders the current logged username with picture
 */
class SupportChatbot extends Component {
  /**
   * render
   * @return {ReactElement} markup
   */
  render() {
    return (
      <div className='support-chatbot'>
        <h1>{FpTranslate('Support Chatbot')}</h1>
        <a className="powered-by" href="https://www.ovhcloud.com" target='blank'>
          <button>
            <img src="assets/logo.png" alt="powered by"  width="20px" height="20px"/>
            <span>{FpTranslate('powered_by')}</span>
          </button>
        </a>
      </div>
    )
  }
}

SupportChatbot.propTypes = {
}

export default SupportChatbot
