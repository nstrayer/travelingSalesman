export default (c, onClick) => {
  const buttonWidth = 100;
  const buttonHeight = 50;
  const resetButton = c.svg
    .selectAppend('g.resetButton')
    .translate([c.width - buttonWidth, c.height - buttonHeight]);

  resetButton.selectAppend('rect').at({
    width: buttonWidth,
    height: buttonHeight,
    rx: 10,
    ry: 10,
    y: -15,
    fill: '#d9d9d9',
    stroke: 'darkgrey',
    strokeWidth: 1,
  });

  resetButton
    .selectAppend('text')
    .text('reset')
    .at({
      x: buttonWidth / 2,
      y: buttonHeight / 1.8 - 15,
      textAnchor: 'middle',
      fontFamily: 'optima',
    });
  resetButton.on('click', onClick);
};
