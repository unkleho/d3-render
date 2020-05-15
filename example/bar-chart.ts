import * as d3 from 'd3';

import render from '../dist';

const margin = {
  top: 5,
  left: 30,
  right: 0,
  bottom: 20,
};

const barChart = (data = [], { width = 100, height = 50 } = {}) => {
  const x = d3
    .scaleBand()
    .domain(d3.range(data.length))
    // .range([margin.left, width - margin.right])
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data, d => d.count)])
    .nice()
    .range([height - margin.bottom, margin.top]);

  const xAxis = d3
    .axisBottom(x)
    .tickFormat(i => data[i].word)
    .tickSizeOuter(0);

  const yAxis = g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(2, 's'))
      .call(selection => selection.select('.domain').remove())
      .call(selection =>
        selection
          .append('text')
          .attr('x', -margin.left)
          .attr('y', 10)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .text(data.y)
      );

  const svg = d3.select('#bar-chart');

  render(svg, [
    {
      append: 'g',
      fill: 'red',
      children: data.map((d, i) => {
        return {
          append: 'rect',
          x: x(i),
          y: y(d.count),
          width: x.bandwidth(),
          height: y(0) - y(d.count),
        };
      }),
    },
  ]);

  // Render order is important. If axis are called before render,
  // things get weird
  svg
    .append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg.append('g').call(yAxis);
};

barChart([
  {
    word: 'Test',
    count: 100,
  },
]);
