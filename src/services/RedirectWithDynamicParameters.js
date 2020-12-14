import _isArray from 'lodash/isArray'
import { set } from 'forepaas/store/querystring/action'
import Store from 'forepaas/store'

/**
  redirectWithDynamicParameters() allows you to redirect to another dasbhoard and udpate DynamicParameters.
    dashboard            : dashboard to navigate to, if null stays on the same
    newDynamicParameters : object with key as dynamic parameter id

  Usage
  import {redirectWithDynamicParameters, buildURLWithDynamicParameters} from 'src/services/redirectWithDynamicParameters'

  render() {
    toDashboard = 'another-page'
    dynParams = {
      category: ['my-category']
    }
    return 
	  '<a href={buildURLWithDynamicParameters(toDashboard, dynParams)} onClick={(e) => {
        e.preventDefault()
        redirectWithDynamicParameters(toDashboard, dynParams)
      }}>more details...</a>'
  }
**/
export const redirectWithDynamicParameters = (dashboard = null, newDynamicParameters = {}) => {
  // Go through the dynamic parameters to update the Store and generate the queryString
  Object.keys(newDynamicParameters).forEach(dynP => {
    const dynamicParamsValue = _isArray(newDynamicParameters[dynP]) ? newDynamicParameters[dynP] : [newDynamicParameters[dynP]]
    Store.dispatch(set(dynP, dynamicParamsValue))
  })

  // Divide the actual url from the char ? to get the dynamic parameters
  const dynPList = window.location.hash.split('?')[1]

  if (dashboard) {
    // Replace the url to navigate to the new url
    const url = `${window.location.origin}${window.location.pathname}#/${dashboard}?${dynPList}`
    window.location.replace(url)
  }
}

// filter values for DynamicParameter encoding
const _filterDynamicParameterValue = (val) => {
  if (typeof(val) === 'undefined' || val === null) {
    return null
  }
  if (typeof(val) === 'number') {
    return val
  }
  if (typeof(val) === 'string') {
    return `%22${encodeURI(val)}%22`
  }
  if (Array.isArray(val)) {
    return val.map(v => _filterDynamicParameterValue(v)).join(',')
  }
  return encodeURI(JSON.stringify(val))
}

export const buildURLWithDynamicParameters = (dashboard = null, newDynamicParameters = {}) => {
  // Divide the actual url from the char ?
  // a[0] = the actual dashboard
  // a[1] = the queryString
  const a = window.location.hash.split('?')
  // build current parameters from QueryString
  const qs = new URLSearchParams(a[1])
  const params = {}
  for(const [k, v] of qs.entries()) {
    try {
      params[k] = JSON.parse(v)
    } catch(e) {
       console.error('Parsing error: ', e)
    }
  }
  // go through new params
  for(const [k, v] of Object.entries(newDynamicParameters)) {
    // may replace previous value
    params[k] = v
  }
  // go through params to build the new query string
  const qsValues = []
  for(const [k, v] of Object.entries(params)) {
    qsValues.push(`${k}=[${_filterDynamicParameterValue(v)}]`)
  }
  // Generated new queryString values
  const qsFormated = qsValues.join('&')

  // Replace the url to navigate to the new url
  const url = `${window.location.origin}${window.location.pathname}${(dashboard === null ? a[0] : `#/${dashboard}`)}?${qsFormated}`
  return url
}


export default {
  redirectWithDynamicParameters, 
  buildURLWithDynamicParameters
}


