const d3 = Object.assign({},require('d3'),require('d3-jetpack'));
const _ = require('lodash');

import slid3r from './slid3r/slid3r';
import setupSliders from './sliderConfigs';
import {makeRoute, flipLocations, acceptNewSolution, calcDistance} from './algorithmFuncs';
import {drawLocations, drawRoute} from './routeDrawing';
import drawHistory from './drawHistory';
import resetButton from './resetButton';
import {
  subChartHeight, 
  distChartConfig, 
  tempChartConfig, 
  flipsChartConfig,
} from './subCharts';

// some constants
const numLocs = 20;
const numberSteps = 10000;

// variables we let user modify
let i = 0;
let tau = 0.5;
let simSpeed = 0;
let numFlips = 2;
let automatedTau = true;
let distanceHistory = [];
let tempHistory = [];
let flipHistory = [];
let updateViz;

// get page width
const pageWidth = document.getElementById('viz').offsetWidth;

// d3 code to draw simple points
const c = d3.conventions({
  parentSel: d3.select('#viz'),
  totalWidth: pageWidth,
  totalHeight: 700,
  margin: {left: 50, right: 50, top: 50, bottom: 50}
});
c.x.domain([0,1])
c.y.domain([0,1])

let route = makeRoute(numLocs);
const locations = _.range(numLocs).map(ind => ({
    x: _.random(0.33, 1, true), 
    y: _.random(0.15, 1, true)
  }));

// sliders
let {flipSlider, speedSlider, tauSlider} = setupSliders({
  c,
  numFlips,
  simSpeed,
  tau,
  subChartHeight,
});

const sliderChange = (pos) => {
  console.log('taking over temp control');
  automatedTau = false;
  tau = pos;
}

const tauContainer = c.svg.selectAppend('g.tauSlider');
tauContainer.call(tauSlider.onDone(sliderChange));

const flipContainer = c.svg.selectAppend('g.flipSlider');
flipContainer.call(flipSlider.onDone(pos => numFlips = pos));

const speedContainer = c.svg.selectAppend('g.speedSlider');
speedContainer.call( speedSlider.onDone(pos => updateViz = makeUpdateViz(pos)) );

drawLocations(c, locations);
resetButton(c, resetProgress)

const makeUpdateViz = (simSpeed) => _.debounce( () => {
  const newRoute = flipLocations(route, numFlips)
  const lastDist = calcDistance(route, locations);
  const currentDist = calcDistance(newRoute, locations);
  const chooseNew = acceptNewSolution(currentDist, lastDist, tau)
  
  route =  chooseNew ? newRoute: route;  
  
  // update tau if we're on automated schedule
  if (automatedTau) {
    tau = 5/(i*0.02 + 1);
    tauContainer.call(tauSlider.startPos(tau));
  }

  // update history vectors
  distanceHistory.push(lastDist);
  tempHistory.push(tau);
  flipHistory.push(numFlips);
  
  // redraw vis with new steps
  drawHistory(c, distChartConfig, distanceHistory);
  drawHistory(c, tempChartConfig, tempHistory);
  drawHistory(c, flipsChartConfig, flipHistory);
  drawRoute(c, route, locations, simSpeed)

  if(i < numberSteps){
    i++
    window.requestAnimationFrame(updateViz);    
  }
}, simSpeed);

updateViz = makeUpdateViz(simSpeed)
window.requestAnimationFrame(updateViz);

function resetProgress(){
  console.log('resetting!')
  distanceHistory = [];
  flipHistory = [];
  tempHistory = [];
  automatedTau = true;
  route = makeRoute(numLocs); 
  i = 0;
}