import FpSdk from 'forepaas/sdk'

import DashboardTitle from './DashboardTitle'
import Username from './Username'
import Toaster from './Toaster'
import WorkInProgress from './WorkInProgress'
import FpDashBlock from './FpDashBlock'
import FpMenuCollapse from './FpMenuCollapse'

export default {
  components: {
    DashboardTitle,
    Username,
    Toaster,
    WorkInProgress,
    FpDashBlock,
    FpMenuCollapse
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
