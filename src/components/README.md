# Components

## How to create a custom component

### Use case
- Add a custom component in menu
- Add a custom component in a dashboard

### First step - Create the component

#### Create the main component file
```js
// ./src/components/Hello/Hello.jsx
import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * Renders an hello-world
 */
class Hello extends Component {
  state = {}

  /**
   * render
   * @return {ReactElement} markup
   */
  render () {
    return (
      <div className='hello'>
        <img src='assets/img/logo.png' className='logo' />
        <h1>Welcome {this.props.name}</h1>
        <p>
          Welcome to your newly created Application
        </p>
      </div>
    )
  }
}

// You can add props, you will be able to set value from architect or from JSON
Hello.propTypes = {
  name: PropTypes.string
}

export default Hello
```
#### Create a style file
```less
// ./src/components/Hello/Hello.less
.hello {
  .logo {
    margin-top: 20px;
    width: 200px;
  }
  text-align:center;
}
```

#### Create and load files
Create an index
```js
// ./src/components/Hello/index.js
import Hello from './Hello.jsx'
import './Hello.less'

export default Hello
```
Add it to the components index

```js
// ./src/components/index.js

import Hello from './Hello'


import FpSdk from 'forepaas/sdk'
import DashboardTitle from './DashboardTitle'
import Username from './Username'
import Toaster from './Toaster'

export default {
  components: {
    Hello,
    DashboardTitle,
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
```

At that moment, your component is ready to use, it will display the HTML you've written inside the render function of the React component.
It will need a props "name" to display the welcome message.


### Second step - Add it to your configuration
#### From JSON
You can add the component to two different part of the application
##### Inside a dashboard
Open a dashboard file "./config/dashboards/overview.json"
Create a new item inside the root "items" or anywhere inside a panel

In that sample, we've added an "hello" component inside a panel.
We may set props directly inside the JSON object (name: user in that sample).
```json
{
  "name": "Overview",
  "width": 36,
  "height": 36,
  "description": "",
  "items": [
    {
      "type": "panel",
      "sizeX": 36,
      "sizeY": 36,
      "row": 0,
      "col": 0,
      "items": [
        {
          "sizeX": 36,
          "sizeY": 34,
          "row": 0,
          "col": 0,
          "type": "hello",
          "name": "user"
        }
      ]
    }
  ],
  "url": "/overview",
  "path": "",
  "tags": []
}
```
The component should now appear on the application.

##### Inside a menu
Open a menu file "./config/menus/header.json"
Create a new item inside a container
```json
{
  "id": "header",
  "class": "header",
  "containers": [
    {
      "id": "mycontainer",
      "items": [
        {
          "type": "hello",
          "name": "user"
        }
      ]
    }
    ...
  ]
}
```
The component should now appear in your menu.

#### From Architect
First, you need to upload your app with the new code, rebuild it, and deploy it.
Next, go in "Dashboard", and select one dashboard to edit.
Select a "+" button (in menu or dashboard) then click on "Custom".

You will have to add it from a json value
```json
{
  "type": "hello",
  "name": "user"
}
```
Confirm, and you should see the component inside your dashboard.



<!-- ## How to create a custom chart component
TODO
### Use case
- Add a new visualization for your data, but without reinvent the wheel

### First step - Create the component

### Second step - Register the component
#### In the SDK
#### In Architect UI

### Third step - Add it to your configuration
#### From JSON
#### From Architect -->
