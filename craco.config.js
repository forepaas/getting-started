const CracoAlias = require("craco-alias");
const CracoLessPlugin = require("craco-less");
const CracoExtendScope = require("@dvhb/craco-extend-scope");

const path = require("path");
const fs = require("fs");

const rewireBabelLoader = require("craco-babel-loader");

// helpers

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  babel: {
    plugins: [
      ["@babel/plugin-proposal-decorators", { legacy: true }],
      "@babel/plugin-proposal-optional-chaining",
      "@babel/plugin-proposal-nullish-coalescing-operator"
    ]
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "jsconfig",
        baseUrl: "."
      }
    },
    { plugin: CracoLessPlugin },
    {
      plugin: rewireBabelLoader,
      options: {
        includes: [resolveApp("forepaas")], //put things you want to include in array here
        excludes: [/(node_modules|bower_components)/] //things you want to exclude here
        //you can omit include or exclude if you only want to use one option
      }
    },
    { plugin: CracoExtendScope, options: { path: "config" } },
    { plugin: CracoExtendScope, options: { path: "forepaas" } },
    { plugin: CracoExtendScope, options: { path: "forepaas.json" } }
  ]
};
