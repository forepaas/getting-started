import FpSdk from 'forepaas/sdk'

import DashboardTitle from './DashboardTitle'
import Hello from './Hello'
import Username from './Username'
import Toaster from './Toaster'
import WorkInProgress from './WorkInProgress'
import ChartTable from './ChartTable'
import ChartDashBlock from './ChartDashBlock'
import MenuCollapse from './MenuCollapse'

export default {
  components: {
    DashboardTitle,
    Hello,
    Username,
    Toaster,
    WorkInProgress,
    ChartTable,
    ChartDashBlock,
    MenuCollapse
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
