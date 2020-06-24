import React from 'react'
import { toast, ToastContainer } from 'react-toastify'

import FpTranslate from 'forepaas/translate'

let currentMessages = {
}

class FpToastifyRenderer extends React.Component {
  render () {
    return <ToastContainer
      type='default'
      position='top-right'
      autoClose={5000}
      hideProgressBar
      closeOnClick
      pauseOnHover
    />
  }
}

class FpToastify {
  constructor () {
    this.succesId = null
    this.errorId = null
    this.name = 'toto'
  }

  pop (message, type) {
    let types = ['success', 'error', 'warn', 'info']
    if (types.indexOf(type) === -1) {
      console.error(`Toaster only have those types : ${types.join(', ')}`)
      return
    }
    if ((type && !this[type + 'Id']) || !toast.isActive(this[type + 'Id'])) {
      this[type + 'Id'] = toast[type](FpTranslate(message))
      currentMessages[type] = message
    }
  }
  success (message) {
    this.pop(message, 'success')
  }
  error (message) {
    this.pop(message, 'error')
  }
  info (message) {
    this.pop(message, 'info')
  }
  warn (message) {
    this.pop(message, 'warn')
  }

  render () {
    return FpToastifyRenderer
  }
}

export default new FpToastify()
