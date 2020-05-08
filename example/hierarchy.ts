import * as d3 from 'd3';

import render from '../.';
import { hierarchy } from 'd3';

function graph(
  root,
  { highlight = () => false, marginLeft = 40, dx = 8, dy = 60 } = {}
) {
  const tree = d3.tree().nodeSize([dx, dy]);

  root = tree(root);

  const treeLink = d3
    .linkHorizontal()
    .x(d => d.y)
    .y(d => d.x);

  let x0 = Infinity;
  let x1 = -x0;

  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  const duration = 1000;

  const data = [
    {
      append: 'g',
      'font-family': 'sans-serif',
      'font-size': 10,
      transform: `translate(${marginLeft},${dx - x0})`,
      duration,
      children: [
        {
          append: 'g',
          key: 'links',
          fill: 'none',
          stroke: '#555',
          'stroke-opacity': 0.4,
          'stroke-width': 1.5,
          duration,
          children: root.links().map(d => {
            return {
              ...d,
              key: d.source.data.key,
              append: 'path',
              d: treeLink,
              'stroke-dasharray': 80,
              'stroke-dashoffset': { enter: 0, exit: 80 },
              delay: { enter: 0, exit: 300 },
              duration,
            };
          }),
        },
        {
          append: 'g',
          key: 'nodes',
          'stroke-linejoin': 'round',
          'stroke-width': 3,
          duration,
          children: root.descendants().map(d => {
            return {
              append: 'g',
              key: d.data.key,
              transform: `translate(${d.y},${d.x})`,
              duration,
              children: [
                {
                  append: 'circle',
                  r: { enter: 3, exit: 0 },
                  fill: d.data.fill || '#999',
                  stroke: d.data.fill === 'white' ? '#999' : undefined,
                  'stroke-width': d.data.fill === 'white' ? 1 : undefined,
                  delay: { enter: 300, exit: 0 },
                  duration,
                },
                {
                  append: 'text',
                  dy: '0.31em',
                  x: d.children ? -6 : 6,
                  'text-anchor': d.children ? 'end' : 'start',
                  text: d.data.append,
                  stroke: 'white',
                  'stroke-opacity': { enter: 1, exit: 0 },
                  'fill-opacity': { enter: 1, exit: 0 },
                  'font-size': { enter: 8, exit: 0 },
                  delay: { enter: 300, exit: 0 },
                  duration,
                },
                {
                  append: 'text',
                  dy: '0.31em',
                  x: d.children ? -6 : 6,
                  'text-anchor': d.children ? 'end' : 'start',
                  text: d.data.append,
                  'fill-opacity': { enter: 1, exit: 0 },
                  'font-size': { enter: 8, exit: 0 },
                  delay: { enter: 300, exit: 0 },
                  duration,
                },
              ],
            };
          }),
        },
      ],
    },
  ];

  render('#hierarchy', data);

  // return svg;
}

const hierarchy1 = d3.hierarchy({
  append: 'svg',
  children: [
    {
      append: 'rect',
      key: 'rect',
      fill: 'pink',
    },
  ],
});

const hierarchy2 = d3.hierarchy({
  append: 'svg',
  children: [
    {
      append: 'rect',
      key: 'rect',
      fill: 'pink',
    },
    {
      append: 'rect',
      key: 'rect',
      fill: 'purple',
    },
    {
      append: 'rect',
      key: 'rect',
      fill: 'lavender',
    },
  ],
});

let i = 0;

const interval = setInterval(() => {
  if (i < 11) {
    graph(i % 2 ? hierarchy1 : hierarchy2);
    i++;
  } else {
    clearInterval(interval);
  }
}, 3000);
