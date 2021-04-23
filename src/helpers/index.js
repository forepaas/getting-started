
// import store from 'forepaas/store'
import _get from 'lodash/get'

window.myFirstHelper = (params) => {
  return true
}

window.hasParameter = (parameterName) => {
    // Get the state from forepaas, if not initialized, return false
    let state = _get(window.Forepaas,'modules.store.getState')
    if(!state) return false
    state = state()
    // get the number of item inside the parameter value, if no element return false, otherwise true
    let valuesnumber = _get(state,`querystring.${parameterName}.length`)
    return !!valuesnumber
}

window.isCurrentDashboard = (dashboards) => {
  // make sure dashboards is an array
  if (!Array.isArray(dashboards)) {
    dashboards = [dashboards]
  }
  // check if current dashboard is in it
  // URL : https://my-dataplant.forepaas.io/my-app/#/my-dashboard?dyn1=..&dyn2=...
  const currentDashboard = window.location.hash.split('?')[0].substr(2)
  return dashboards.includes(currentDashboard)
}
