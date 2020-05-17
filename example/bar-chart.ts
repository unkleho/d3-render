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
      .call(selection => selection.select('.domain').remove());

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
          duration: 1000,
        };
      }),
    },
    {
      append: 'g',
      transform: `translate(0, ${height - margin.bottom})`,
      call: xAxis,
    },
    {
      append: 'g',
      call: yAxis,
    },
  ]);
};

let i = 0;

const data1 = [
  {
    word: 'A',
    count: 100,
  },
  {
    word: 'B',
    count: 80,
  },
];

const data2 = [
  {
    word: 'A',
    count: 20,
  },
  {
    word: 'B',
    count: 50,
  },
];

barChart(data1);

setInterval(() => {
  if (i <= 10) {
    barChart(i % 2 ? data2 : data1);
    i++;
  }
}, 2000);
