const d3 = Object.assign({}, require('d3'), require('d3-jetpack'));

export default (c, route, locations, simSpeed) => {
  const line = d3
    .line()
    .x((d) => c.x(d.x))
    .y((d) => c.y(d.y));

  const routeLocations = route.map((loc) => locations[loc]);

  const routePath = c.svg.selectAppend('path.routePath').at({
    fill: 'none',
    stroke: '#80b1d3',
    strokeWidth: '2px',
  });

  routePath
    .datum(routeLocations)
    .transition(d3.transition('routeChange').duration(simSpeed))
    .attr('d', line);
};
