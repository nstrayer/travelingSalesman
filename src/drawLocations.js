const d3 = Object.assign({}, require('d3'), require('d3-jetpack'));

export default (c, locations, onAdd, onRemove) => {
  c.svg
    .selectAppend('rect.addNewLoc')
    .at({
      x: c.width * 0.26,
      width: c.width * 0.75,
      height: c.height,
      fill: 'orangered',
      fillOpacity: 0.1,
      rx: 15,
      ry: 15,
    })
    .on('click', function() {
      onAdd(d3.mouse(this));
    });

  const locDots = c.svg.selectAll('.location').data(locations, (d) => d.x);

  locDots.exit().remove();

  locDots
    .enter()
    .append('circle.location')
    .at({
      cx: (d) => c.x(d.x),
      cy: (d) => c.y(d.y),
      r: 1e-10,
      fill: '#fb8072',
    })
    .on('mouseover', function() {
      d3
        .select(this)
        .transition(d3.transition('locationGrow').duration(500))
        .attr('r', 15);
    })
    .on('click', onRemove)
    .on('mouseout', function() {
      d3
        .select(this)
        .transition(d3.transition('locationGrow').duration(500))
        .attr('r', 10);
    })
    .transition(d3.transition('locationEnter').duration(500))
    .at({r: 10});
};
