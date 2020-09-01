# ForePaaS : React Template

This is the React template. You can use this template by choosing it in the ForePaaS marketplace.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)

### Installing

Follow these steps to run the application locally :

Install node packages :

```sh
yarn
```

Install npx :

```sh
yarn global add npx
```

Install forepaas packages

```sh
yarn fppm
```

Run the application

```sh
yarn start
```

## Customize your Application

The `src` directory is organized as below :

```
|-- src/
    |-- authentication/
    |-- helpers/
    |-- templates/
    |-- components/
```

Here is a short description of those directories, what structure they should have and what they are used for:

- Authentication

  This allows you to override the default ForePaaS authentication behavior.
  A simple example of this would be if you wanted to change the behavior or HTML structure of the login form.
  You would simply create your component's class in this directory. This class can either extend the original one (in the `forepaas/` directory) or be an entirely new one.
  Either way, in order to override a component, you need to make sure yours has the same name as one being overridden and is imported in the `authentication/index.js` file and added in the `components` property.

- Helpers

  This directory is very straight-forward, you can create helper functions that can then be called anywhere else in your code.
  ForePaaS recommends to code these functions in the `window` variable, making sure you can always call them, from anywhere in the application.

* Templates

  This directory stores the different _dashboarding templates_. This means that these templates are the React components that can interpret the JSON of the dashboarding in order to display it.
  Once a template is created, you can use it in a dashboard by adding the `template` property at the root of a dashboard object. For example, a new template would be imported this way in the `templates/index.js` file:

  ```js
  import FpSdk from "forepaas/sdk";
  import main from "./main.jsx";
  import myCustomTemplate from "./myCustomTemplate.jsx";

  export default {
    templates: {
      main,
      myCustomTemplate
    },
    camelCaseToDash(myStr) {
      return myStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    },
    init() {
      for (let template in this.templates) {
        FpSdk.modules.dashboarding.templates[
          this.camelCaseToDash(template)
        ] = this.templates[template];
      }
    }
  };
  ```

  This same template could then be used in the dashboard's JSON file this way:

  ```json
  {
    "name": "myDashboard",
    "template": "my-custom-template",
    "width": 36,
    "height": 36,
    "items": [
      ...
    ],
    ...
  }
  ```

* Components

  This directory is where most of the custom code goes. Components are all the elements that will be called using JSON in the `/config` directory.
  Just like the authentication components and templates, these classes can either extend the original ones (in the `forepaas/` directory) or be an entirely new one. In order to override a component, you need to make sure yours has the same name as one being overridden. Either way, it needs to then be imported in the `components/index.js` file and added in the `components` property.
  To refer to this component from JSON files in the `/config` directory, simply write the hyphenated name of your component in the `type` property.
  There are exceptions as charts and dynamic parameters require the underlying component to have a name equal to the type + component. Therefore, in order to create custom charts or dynamic parameters, your component's class will need the prefix `Chart` or `DynamicParameter`.
  For example:

  ```json
  // A React component may be called like below from a JSON configuraiton file.
  // This will refer to a React component called `MyCustomComponent`
  {
    "type": "my-custom-component",
    "my-props": "my value"
  }

  // A chart component may be called like below from a JSON configuraiton file.
  // This will refer to a component called `ChartMyCustomComponent`
  // The major difference with the previous example is that you will be able to connect that chart to a Query Builder request.
  {
    "type": "chart",
    ...
    "chart": {
      "component": "my-custom-component",
      ...
    }
  }
  ```

Except for helpers, all modules in the `src` have to be initialized to work.
Once the module is created in the right directory, simply import it in the directory's `index.js` and add it to the `components` property.
The end result should look like that:

```js
import FpSdk from "forepaas/sdk";

import DashboardTitle from "./DashboardTitle";
import Username from "./Username";
import Toaster from "./Toaster";

export default {
  components: {
    DashboardTitle,
    Username,
    Toaster
  },
  camelCaseToDash(myStr) {
    return myStr.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  },
  init() {
    for (let component in this.components) {
      FpSdk.modules[this.camelCaseToDash(component)] = this.components[
        component
      ];
    }
  }
};
```

You will find further information in `src/components/README.md`

## Built With

- [React](https://reactjs.org/)
- [Npm](https://www.npmjs.com/)

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/forepaas/getting-started/branches).

## License

See [LICENSE](LICENSE.md) for details
