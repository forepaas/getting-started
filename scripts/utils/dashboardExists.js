/**
 * dashboardExists
 *
 * Check if the given dashboard exists in the dashboard directory
 */

const fs = require('fs')
const path = require('path')
const dashboards = fs.readdirSync(
  path.join(__dirname, '../../config/dashboards')
)
function dashboardExists (comp) {
  return dashboards.indexOf(`${comp}.json`) >= 0
}

module.exports = dashboardExists
