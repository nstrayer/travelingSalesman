const d3 = Object.assign({},require('d3'),require('d3-jetpack'));
const _ = require('lodash');

import slid3r from './slid3r/slid3r';
import {makeRoute, flipLocations, acceptNewSolution, calcDistance} from './algorithmFuncs';
import {drawLocations, drawRoute} from './routeDrawing';
import drawHistory from './drawHistory';

// some constants
const numLocs = 20

// variables we let user modify
let tau = 0.5;
let simSpeed = 20;
let numFlips = 2;

const distanceHistory = [];
const tempHistory = [];
const flipHistory = [];

// d3 code to draw simple points
const c = d3.conventions({
  parentSel: d3.select('#viz'),
  totalWidth: 1000,
  totalHeight: 700,
  margin: {left: 50, right: 50, top: 50, bottom: 50}
});
c.x.domain([0,1])
c.y.domain([0,1])

let route = makeRoute(numLocs);
const locations = _.range(numLocs)
  .map(ind => ({
    x: _.random(0.33, 1, true), 
    y: _.random(1, true)
  }))

const subChartHeight = 100;
const distChartConfig = {
  c, 
  name:'distHist',
  title: 'Distance',
  height: subChartHeight
};

const tempChartConfig = {
  c, 
  name:'tempHist',
  title: 'Temperature',
  height: subChartHeight,
  loc: [0, subChartHeight + 30]
};

const flipsChartConfig = {
  c, 
  name:'flipHist',
  title: '# changes each gen',
  loc: [0, (subChartHeight + 65)*2]
};

const tauSlider = slid3r()
  .width(c.width * 0.2)
  .range([0,0.5])
  .startPos(tau)
  .loc([10, subChartHeight + 170])
  .vertical(false)
  .label('Set Cooling Temp')
  .clamp(false)
  .onDone(pos => tau = pos);

c.svg
  .selectAppend('g.tauSlider')
  .call(tauSlider)
  // .attr('transform', 'rotate(90)');


const flipSlider = slid3r()
  .width(c.width * 0.2)
  .range([1,5])
  .startPos(numFlips)
  .loc([10, (subChartHeight + 65)*2 + 150])
  .label('Set Number of Changes per gen')
  .clamp(true)
  .onDone(pos => numFlips = pos);

c.svg.selectAppend('g.flipSlider').call(flipSlider);

// const speedSlider = slid3r()
//   .width(c.width * 0.2)
//   .range([10,1000])
//   .startPos(simSpeed)
//   .loc([10, c.height*0.7])
//   .label('Set Simulation Speed (ms per gen)')
//   .clamp(true)
//   .onDone(pos => simSpeed = pos);

// c.svg.selectAppend('g.speedSlider').call(speedSlider);




drawLocations(c, locations);

setInterval(() => {
// setTimeout(() => {
  const newRoute = flipLocations(route, numFlips)
  const lastDist = calcDistance(route, locations);
  const currentDist = calcDistance(newRoute, locations);
  distanceHistory.push(lastDist);
  tempHistory.push(tau);
  flipHistory.push(numFlips);
  
  drawHistory(distChartConfig, distanceHistory);
  drawHistory(tempChartConfig, tempHistory);
  drawHistory(flipsChartConfig, flipHistory);
  
  const chooseNew = acceptNewSolution(currentDist, lastDist, tau)
  route =  chooseNew ? newRoute: route;  
  drawRoute(c, route, locations, simSpeed)
}, simSpeed);

