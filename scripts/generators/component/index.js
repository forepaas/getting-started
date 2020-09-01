/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict'

const componentExists = require('../../utils/componentExists')

module.exports = {
  description: 'Add a component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should your component be called?',
      default: 'Button',
      validate: value => {
        if (/.+/.test(value)) {
          return componentExists(value)
            ? 'A component with this name already exists'
            : true
        }
        return 'The name is required'
      }
    },
    {
      type: 'confirm',
      name: 'class',
      default: false,
      message: 'Do you want it to be a Class Component ?'
    }
  ],
  actions: () => {
    // Generate index.js, {{properCase name}}.js and {{properCase name}}.less files
    return [
      {
        type: 'add',
        path: '../../src/components/{{properCase name}}/index.js',
        templateFile: './component/index.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: '../../src/components/{{properCase name}}/{{properCase name}}.jsx',
        templateFile: './component/component.jsx.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: '../../src/components/{{properCase name}}/{{properCase name}}.less',
        templateFile: './component/style.less.hbs',
        abortOnFail: true
      }
    ]
  }
}
