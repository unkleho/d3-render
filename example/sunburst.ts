import * as d3 from 'd3';

import render from '../.';

const data = {
  title: 'Root',
  children: [
    {
      title: 'A',
      value: 0,
      children: [
        {
          title: 'AA',
          value: 1,
        },
        {
          title: 'AB',
          value: 1,
        },
      ],
    },
    {
      title: 'B',
      value: 1,
    },
  ],
};

const radius = 25;

const partition = data =>
  d3.partition().size([2 * Math.PI, radius])(
    d3.hierarchy(data).sum(d => d.value)
    // .sort((a, b) => b.value - a.value)
  );

const arc = d3
  .arc()
  .startAngle(d => d.x0)
  .endAngle(d => d.x1)
  .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
  .padRadius(radius / 2)
  .innerRadius(d => d.y0)
  .outerRadius(d => d.y1 - 1);

const color = d3.scaleOrdinal(
  d3.quantize(d3.interpolateRainbow, data.children.length + 1)
);

const format = d3.format(',d');

const graph = data => {
  const root = partition(data);
  // const svg = d3.create('svg');
  const renderData = [
    {
      append: 'g',
      fillOpacity: 0.6,
      children: root
        .descendants()
        .filter(d => d.depth)
        .map(d => {
          return {
            append: 'path',
            fill: () => {
              while (d.depth > 1) d = d.parent;
              return color(d.data.name || d.data.title);
            },
            d: arc(d),
            children: [
              {
                append: 'title',
                text: () =>
                  `${d
                    .ancestors()
                    .map(d => d.data.name || d.data.title)
                    .reverse()
                    .join('/')}\n${format(d.value)}`,
              },
            ],
          };
        }),
    },
    {
      append: 'g',
      pointerEvents: 'none',
      textAnchor: 'middle',
      fontSize: 10,
      fontFamily: 'sans-serif',
      children: root
        .descendants()
        .filter(d => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
        .map(d => {
          return {
            append: 'text',
            transform: () => {
              const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
              const y = (d.y0 + d.y1) / 2;
              return `rotate(${x - 90}) translate(${y},0) rotate(${
                x < 180 ? 0 : 180
              })`;
            },
            dy: '0.35em',
            text: d.data.title,
          };
        }),
    },
  ];

  render('#sunburst', renderData);
};

graph(data);
