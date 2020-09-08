// import store from 'forepaas/store'
// import {get} from 'lodash'

window.myFirstHelper = params => {
  return true;
};

const flattenChartResults = results => {
  let flattenedChartResults = [];
  results.forEach(result => {
    let fieldEntries = [];
    Object.entries(result.data).forEach(([fieldName, computeModes]) => {
      Object.entries(computeModes).forEach(([computeModeName, rows]) => {
        computeModeName === "select"
          ? fieldEntries.push([fieldName, rows[0].value])
          : fieldEntries.push([
              `${fieldName}_${computeModeName}`,
              rows[0].value
            ]);
      });
    });
    let flattenedObject = {
      ...result.scales,
      ...Object.fromEntries(fieldEntries)
    };
    flattenedChartResults.push(flattenedObject);
  });
  return flattenedChartResults;
};

export { flattenChartResults };
