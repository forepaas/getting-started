/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict'

const dashboardExists = require('../../utils/dashboardExists')

module.exports = {
  description: 'Add a dashboard',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should your dashboard be called?',
      default: 'overview',
      validate: value => {
        if (/.+/.test(value)) {
          return dashboardExists(value)
            ? 'A dashboard with this name already exists'
            : true
        }

        return 'The name is required'
      }
    }
  ],
  actions: data => {
    // Generate dashboard file
    const actions = [
      {
        type: 'add',
        path: '../../config/dashboards/{{kebabCase name}}.json',
        templateFile: './dashboard/dashboard.json.hbs',
        abortOnFail: true
      }
    ]
    return actions
  }
}
