const CracoAlias = require("craco-alias");
const CracoLessPlugin = require("craco-less");
const CracoExtendScope = require("@dvhb/craco-extend-scope");

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
    { plugin: CracoLessPlugin }
  ]
};
