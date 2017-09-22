const d3 = Object.assign({},require('d3'),require('d3-jetpack'));

export default (config, distHistory) => {
  const {
    c, 
    name, 
    title, 
    loc = [0,0], 
    padding = 12,
    height = 100 
  } = config;

  // mini line chart for the route distance
  const width = c.width * 0.25;
  // const height = c.height * 0.25;

  const distanceContainer = c.svg
    .selectAppend('g.' + name)
    .translate(loc);

  const distX = d3.scaleLinear()
    .range([padding, width-padding ])
    .domain([0, distHistory.length]);
  
  const distY = d3.scaleLinear()
    .range([height - padding, padding])
    .domain(d3.extent(distHistory));
  
  // background 
  distanceContainer.selectAppend('rect.background')
    .at({
      width: width,
      height: height,
      fill: 'lightgrey',
      rx: 10,
      ry: 10,
    });
  
  // title text
  distanceContainer.selectAppend('text.title')
    .at({ 
      fontFamily: 'optima',
      y: -padding/2,
      x: padding
    })
    .text(title)
  
  const line = d3.line().x((d,i) => distX(i)).y(d => distY(d));
  
  distanceContainer
    .selectAppend('path.distHist')
    .at({
        fill: 'none',
        stroke: 'orangered',
        strokeWidth: '1px'
      })
      .datum(distHistory)
      .attr('d', line);
}