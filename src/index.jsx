import React from 'react'
import { render } from 'react-dom'
import FpSdk from 'forepaas/sdk'
import templates from 'src/templates'
import components from 'src/components'
import authentication from 'src/authentication'
import AppTemplate from 'forepaas/sdk/templates/default.jsx'

import 'react-toastify/dist/ReactToastify.min.css'
import 'font-awesome/less/font-awesome.less'
import 'src/styles/styles.less'
import 'src/helpers'

// TODO rajouter fr.json

FpSdk.start()
  .then(() => {
    authentication.init()
    templates.init()
    return components.init()
  })
  .then(() => {
    render(<AppTemplate />, document.getElementById('root'))
  })
