/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const componentGenerator = require('./component/index.js')
const dashboardGenerator = require('./dashboard/index.js')

/**
 * Every generated backup file gets this extension
 * @type {string}
 */

module.exports = plop => {
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('dashboard', dashboardGenerator)
}
