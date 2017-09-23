export const subChartHeight = 100;
export const distChartConfig = {
  name:'distHist',
  title: 'Distance',
  height: subChartHeight
};

export const tempChartConfig = {
  name:'tempHist',
  title: 'Temperature',
  height: subChartHeight,
  loc: [0, subChartHeight + 30]
};

export const flipsChartConfig = {
  name:'flipHist',
  title: '# changes each gen',
  loc: [0, (subChartHeight + 65)*2]
};
