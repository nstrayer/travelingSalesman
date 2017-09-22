(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var animationSpeed = 100;
// Takes a given number of cities and makes a random route 
// between them starting and ending at the first city
var makeRoute = function makeRoute() {
  var numLocs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 26;

  var innerRoute = _.shuffle(_.range(1, numLocs));
  return [0].concat(_toConsumableArray(innerRoute), [0]);
};

// mutates our route by flipping two random locations
// if more than one set of flips is requested it will
// recursively perform the flips until finishing.
var flipLocations = function flipLocations(route) {
  var numFlips = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  // choose two random indexes and flip them
  var indexOne = _.random(1, route.length - 1);
  var indexTwo = _.random(1, route.length - 1);
  var newRoute = route.map(function (el, i) {
    return i == indexOne ? route[indexTwo] : i == indexTwo ? route[indexOne] : el;
  });
  return numFlips == 1 ? newRoute : flipLocations(newRoute, numFlips - 1);
};

var eucDist = function eucDist(p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
};

// Takes a given route and the information on the route's locations coordinates
// and will calculate the total euclidean distance of the current route.
var calcDistance = function calcDistance(route, locations) {
  return _.chain(route.length - 1).range().map(function (i) {
    var loc1 = locations[route[i]];
    var loc2 = locations[route[i + 1]];
    return eucDist(loc1, loc2);
  }).sum().value();
};

// Takes current generations distance and last generation along with current temp
// and returns a boolean of if this new solution should be excepted/
var acceptNewSolution = function acceptNewSolution(currentDist, lastDist, tau) {
  if (currentDist < lastDist) return true;

  var alpha = Math.min(1, Math.exp((lastDist - currentDist) / tau));

  return _.random(1, true) < alpha;
};

// d3 code to draw simple points
var c = d3.conventions({
  parentSel: d3.select('#viz'),
  totalWidth: 1000,
  margin: { left: 50, right: 50, top: 50, bottom: 50 }
});
c.x.domain([0, 1]);
c.y.domain([0, 1]);

var drawLocations = function drawLocations(c, locations) {
  var locDots = c.svg.selectAll(".location").data(locations);

  locDots.exit().remove();

  locDots.enter().append('circle.location').at({
    cx: function cx(d) {
      return c.x(d.x);
    },
    cy: function cy(d) {
      return c.y(d.y);
    },
    r: 1e-10,
    fill: "steelblue"
  }).transition(d3.transition('locationEnter').duration(500)).at({ r: 10 });
};

var drawRoute = function drawRoute(c, route, location) {
  var line = d3.line().x(function (d) {
    return c.x(d.x);
  }).y(function (d) {
    return c.y(d.y);
  });

  var routeLocations = route.map(function (loc) {
    return locations[loc];
  });

  var routePath = c.svg.selectAppend('path.routePath').at({
    fill: 'none',
    stroke: 'orangered',
    strokeWidth: '2px'
  });

  routePath.datum(routeLocations).transition(d3.transition('routeChange').duration(animationSpeed)).attr('d', line);
};

var drawHistory = function drawHistory(distHistory) {
  var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : c.width * 0.25;
  var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : c.height * 0.25;

  // mini line chart for the route distance
  var distanceContainer = c.svg.selectAppend('g.distChart');
  var padding = 10;

  var distX = d3.scaleLinear().range([0, width]).domain([0, distHistory.length]);

  var distY = d3.scaleLinear().range([height, 0]).domain(d3.extent(distHistory));

  // background 
  distanceContainer.selectAppend('rect.background').at({
    x: -padding,
    y: -padding * 2,
    width: width + padding * 2,
    height: height + padding * 3,
    fill: 'lightgrey',
    rx: 10,
    ry: 10
  });

  // title text
  distanceContainer.selectAppend('text.title').at({ fontFamily: 'optima' }).text("Route Distance Over Time");

  var line = d3.line().x(function (d, i) {
    return distX(i);
  }).y(function (d) {
    return distY(d);
  });

  distanceContainer.selectAppend('path.distHist').at({
    fill: 'none',
    stroke: 'orangered',
    strokeWidth: '1px'
  }).datum(distHistory).transition(d3.transition('histChnge').duration(animationSpeed)).attr('d', line);
};

var numLocs = 10;
var tau = 10;
var distanceHistory = [];

var route = makeRoute(numLocs);
var locations = _.range(numLocs).map(function (ind) {
  return {
    x: _.random(1, true),
    y: _.random(1, true)
  };
});

drawLocations(c, locations);

// make new route
setInterval(function () {
  var newRoute = flipLocations(route);
  var lastDist = calcDistance(route, locations);
  var currentDist = calcDistance(newRoute, locations);
  distanceHistory.push(lastDist);
  drawHistory(distanceHistory);
  route = acceptNewSolution(currentDist, lastDist, tau) ? newRoute : route;
  drawRoute(c, route, locations);
}, 100);

},{}]},{},[1]);
