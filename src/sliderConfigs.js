import slid3r from './slid3r/slid3r';

export default ({
  c,
  numFlips,
  simSpeed,
  tau,
  subChartHeight,
}) => {
  const flipSlider = slid3r()
    .width(c.width * 0.2)
    .range([1,5])
    .startPos(numFlips)
    .loc([10, (subChartHeight + 65)*2 + 150])
    .label('Set Number of Changes per gen')
    .clamp(true);
  
  const speedSlider = slid3r()
    .width(c.width * 0.2)
    .range([0,500])
    .startPos(simSpeed)
    .loc([10, (subChartHeight + 65)*2.5 + 150])
    .label('Step Delay (ms)')
    .numTicks(4)    
    .clamp(true);
  
  const tauSlider = slid3r()
    .width(c.width * 0.2)
    .range([0,1])
    .startPos(tau)
    .loc([10, subChartHeight + 170])
    .vertical(false)
    .label('Set Cooling Temp')
    .numTicks(7)
    .clamp(false);

  return {
    flipSlider,
    speedSlider,
    tauSlider,
  }
}  
