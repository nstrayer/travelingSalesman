const d3 = Object.assign({}, require('d3'), require('d3-jetpack'));
const _ = require('lodash');
import setupSliders from './sliderConfigs';
import {
  makeRoute,
  flipLocations,
  acceptNewSolution,
  calcDistance,
} from './algorithmFuncs';
import drawRoute from './drawRoute';
import drawLocations from './drawLocations';
import drawHistory from './drawHistory';
import resetButton from './resetButton';
import {
  subChartHeight,
  distChartConfig,
  tempChartConfig,
  flipsChartConfig,
} from './subCharts';
import makeLocations from './makeLocations';

// some constants
const numberSteps = 10000;
const simSpeed = 0;

// variables we let user modify
let numLocs = 15;
let i = 0;
let tau = 0.5;
let numFlips = 2;
let automatedTau = true;
let distanceHistory = [];
let tempHistory = [];
let flipHistory = [];
let updateViz;

// get page width
const pageWidth = document.getElementById('viz').offsetWidth;
const controlWidthProp = pageWidth < 500 ? 0.5 : 0.3;
console.log(`page is ${pageWidth} px wide`);

let locations = makeLocations(numLocs, controlWidthProp);
let route = makeRoute(numLocs);

// setup the viz
const c = d3.conventions({
  parentSel: d3.select('#viz'),
  totalWidth: pageWidth,
  totalHeight: 700,
  margin: {
    left: 50,
    right: 50,
    top: 50,
    bottom: 50,
  },
});
c.x.domain([0, 1]);
c.y.domain([0, 1]);

// sliders
const {flipSlider, speedSlider, tauSlider} = setupSliders({
  c,
  numFlips,
  simSpeed,
  tau,
  subChartHeight,
});

const sliderChange = (pos) => {
  automatedTau = false;
  tau = pos;
};

const tauContainer = c.svg.selectAppend('g.tauSlider');
tauContainer.call(tauSlider.onDone(sliderChange));

const flipContainer = c.svg.selectAppend('g.flipSlider');
flipContainer.call(
  flipSlider.onDone((pos) => {
    numFlips = pos;
  })
);

const speedContainer = c.svg.selectAppend('g.speedSlider');
speedContainer.call(
  speedSlider.onDone((pos) => (updateViz = makeUpdateViz(pos)))
);

const addLocation = ([x, y]) => {
  locations.push({x: c.x.invert(x), y: c.y.invert(y)});
  drawLocations({c, locations, onAdd: addLocation, onRemove: removeLocation, controlWidthProp});
  numLocs = locations.length;
  route = makeRoute(numLocs);
  resetProgress();
};

const removeLocation = (d) => {
  console.log(d);
  const index = locations.indexOf(d);
  locations.splice(index, 1);
  drawLocations({c, locations, onAdd: addLocation, onRemove: removeLocation, controlWidthProp});
  numLocs = locations.length;
  route = makeRoute(numLocs);
  resetProgress();
};

drawLocations({c, locations, onAdd: addLocation, onRemove: removeLocation, controlWidthProp});
resetButton(c, resetProgress);

const makeUpdateViz = (simSpeed) =>
  _.debounce(() => {
    const newRoute = flipLocations(route, numFlips);
    const lastDist = calcDistance(route, locations);
    const currentDist = calcDistance(newRoute, locations);
    const chooseNew = acceptNewSolution(currentDist, lastDist, tau);

    route = chooseNew ? newRoute : route;

    // update tau if we're on automated schedule
    if (automatedTau) {
      tau = 5 / (i * 0.06 + 1);
      tauContainer.call(tauSlider.startPos(tau));
    }

    // update history vectors
    distanceHistory.push(lastDist);
    tempHistory.push(tau);
    flipHistory.push(numFlips);

    // redraw vis with new steps
    drawHistory(c, {...distChartConfig, controlWidthProp}, distanceHistory);
    drawHistory(c, {...tempChartConfig, controlWidthProp}, tempHistory);
    drawHistory(c, {...flipsChartConfig, controlWidthProp}, flipHistory);
    drawRoute(c, route, locations, simSpeed);

    if (i < numberSteps) {
      i++;
      window.requestAnimationFrame(updateViz);
    }
  }, simSpeed);

updateViz = makeUpdateViz(simSpeed);
window.requestAnimationFrame(updateViz);

function resetProgress() {
  console.log('resetting!');
  distanceHistory = [];
  flipHistory = [];
  tempHistory = [];
  automatedTau = true;
  route = makeRoute(numLocs);
  i = 0;
}
