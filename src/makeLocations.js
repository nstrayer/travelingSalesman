const _ = require('lodash');

export default (numLocs, controlWidthProp) =>
  _.range(numLocs).map(() => ({
    x: _.random(controlWidthProp + 0.02, 1, true),
    y: _.random(0.15, 1, true),
  }));
