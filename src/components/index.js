import FpSdk from 'forepaas/sdk'

import Username from './Username'
import Toaster from './Toaster'

export default {
  components: {
    Username,
    Toaster
    },
  camelCaseToDash (myStr) {
    return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  },
  init () {
    for (let component in this.components) {
      FpSdk.modules[this.camelCaseToDash(component)] = this.components[component]
    }
  }
}
