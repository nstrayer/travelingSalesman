const _ = require('lodash');

// Takes a given number of cities and makes a random route
// between them starting and ending at the first city
export const makeRoute = (numLocs = 26) => {
  const innerRoute = _.shuffle(_.range(1, numLocs));
  return [0, ...innerRoute, 0];
};

// mutates our route by flipping two random locations
// if more than one set of flips is requested it will
// recursively perform the flips until finishing.
export const flipLocations = (route, numFlips = 1) => {
  // the index we're going to swap
  const indexOne = _.random(1, route.length - 2);
  // the index to which we will switch it
  const indexTwo = _.random(1, route.length - 2);

  const takenOut = route.filter((d, i) => i != indexOne);
  const beforeFlipped = takenOut.slice(0, indexTwo);
  const afterFlipped = takenOut.slice(indexTwo, route.length);
  const newRoute = [...beforeFlipped, route[indexOne], ...afterFlipped];
  return numFlips == 1 ? newRoute : flipLocations(newRoute, numFlips - 1);
};

export const eucDist = (p1, p2) =>
  Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

// Takes a given route and the information on the route's locations coordinates
// and will calculate the total euclidean distance of the current route.
export const calcDistance = (route, locations) =>
  _.chain(route.length - 1)
    .range()
    .map((i) => {
      const loc1 = locations[route[i]];
      const loc2 = locations[route[i + 1]];
      return eucDist(loc1, loc2);
    })
    .sum()
    .value();

// Takes current generations distance and last generation along with current temp
// and returns a boolean of if this new solution should be excepted/
export const acceptNewSolution = (currentDist, lastDist, tau) => {
  if (currentDist < lastDist) {
    // console.log("the new route is shorter than the old.")
    return true;
  }

  const alpha = Math.min(1, Math.exp((lastDist - currentDist) / tau));

  return _.random(1, true) < alpha;
};
