const _ = require('lodash');

export default (numLocs) =>
  _.range(numLocs).map(() => ({
    x: _.random(0.33, 1, true),
    y: _.random(0.15, 1, true),
  }));
