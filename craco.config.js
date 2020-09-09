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
    plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]]
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
        includes: [resolveApp("forepaas")],
        excludes: [/(node_modules|bower_components)/]
      }
    },
    { plugin: CracoExtendScope, options: { path: "assets" } },
    { plugin: CracoExtendScope, options: { path: "config" } },
    { plugin: CracoExtendScope, options: { path: "forepaas" } },
    { plugin: CracoExtendScope, options: { path: "forepaas.json" } }
  ]
};
