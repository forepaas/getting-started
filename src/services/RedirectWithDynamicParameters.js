import _isArray from 'lodash/isArray'
import { set } from 'forepaas/store/querystring/action'
import Store from 'forepaas/store'

/**
  redirectWithDynamicParameters() allows you to redirect to another dasbhoard and udpate DynamicParameters or other states.
    dashboard            : dashboard to navigate to, if null stays on the same
    newDynamicParameters : object with key as dynamic parameter id
    newState             : other values to change in store

  Usage
  import redirectWithDynamicParameters from 'src/services/redirectWithDynamicParameters'

  render() {
    toDashboard = 'another_page'
    categoryID = 'my-category'
    return '<a href="#" onClick={() => redirectWithDynamicParameters(toDashboard, {dynCategory: categoryID})}>link to</a>'
  }
**/
const redirectWithDynamicParameters = (dashboard = null, newDynamicParameters = {}, newState = {}) => {
  // Go through the dynamic parameters to update the Store and generate the queryString
  Object.keys(newDynamicParameters).forEach(dynP => {
    const dynamicParamsValue = _isArray(newDynamicParameters[dynP]) ? newDynamicParameters[dynP] : [newDynamicParameters[dynP]]
    Store.dispatch(set(dynP, dynamicParamsValue))
  })

  // Update Store with the new value if there are some
  Object.keys(newState).forEach(state => {
    Store.dispatch(set(state, newState[state]))
  })

  if (dashboard) {
    // Replace the url to navigate to the new url
    const url = `${window.location.origin}${window.location.pathname}#/${dashboard}`
    window.location.replace(url)
  }
}

export default redirectWithDynamicParameters

