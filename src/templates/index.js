import FpSdk from 'forepaas/sdk'
import main from './main.jsx'

export default {
  templates: {
    main
  },
  camelCaseToDash (myStr) {
    return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  },
  init () {
    for (let template in this.templates) {
      FpSdk.modules.dashboarding.templates[this.camelCaseToDash(template)] = this.templates[template]
    }
  }
}
