const d3 = Object.assign({},require('d3'),require('d3-jetpack'));
const animationSpeed = 100;

export const drawLocations = (c, locations) => {
  const locDots = c.svg.selectAll(".location")
    .data(locations);

  locDots.exit()
    .remove()

  locDots.enter()
    .append('circle.location')
    .at({
      cx: d => c.x(d.x),
      cy: d => c.y(d.y),
      r: 1e-10,
      fill: "steelblue"
    })
    .transition(d3.transition('locationEnter').duration(500))
    .at({r: 10});
}

export const drawRoute = (c, route, locations, simSpeed) => {
  const line = d3.line()
    .x(d => c.x(d.x))
    .y(d => c.y(d.y));

  const routeLocations = route.map(loc => locations[loc])

  const routePath = c.svg.selectAppend('path.routePath')
    .at({
      fill: 'none',
      stroke: 'orangered',
      strokeWidth: '2px'
    });

  routePath.datum(routeLocations)
    .transition(d3.transition('routeChange').duration(simSpeed))
    .attr('d', line)
}