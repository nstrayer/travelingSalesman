const d3 = Object.assign({}, require('d3'), require('d3-jetpack'));

export default (c, config, distHistory) => {
  const {name, title, loc = [0, 0], padding = 12, height = 100} = config;

  // mini line chart for the route distance
  const width = c.width * 0.25;

  const distanceContainer = c.svg.selectAppend(`g.${name}`).translate(loc);

  const distX = d3
    .scaleLinear()
    .range([padding, width - padding])
    .domain([0, distHistory.length]);

  const distY = d3
    .scaleLinear()
    .range([height - padding, padding])
    .domain(d3.extent(distHistory));

  // background
  distanceContainer.selectAppend('rect.background').at({
    width,
    height,
    fill: '#d9d9d9',
    fillOpacity: 0.2,
    rx: 10,
    ry: 10,
    stroke: 'darkgrey',
    strokeWidth: 1,
  });

  // title text
  distanceContainer
    .selectAppend('text.title')
    .at({
      fontFamily: 'optima',
      y: -padding / 2,
      x: padding,
    })
    .text(title);

  const line = d3
    .line()
    .x((d, i) => distX(i))
    .y((d) => distY(d));

  distanceContainer
    .selectAppend('path.distHist')
    .at({
      fill: 'none',
      stroke: '#bc80bd',
      strokeWidth: '2px',
    })
    .datum(distHistory)
    .attr('d', line);
};
