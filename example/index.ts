// import * as d3 from 'd3';

import render from '../';

const selection = render('#svg', [
  {
    as: 'g',
    children: [
      {
        as: 'rect',
        width: 100,
        height: 100,
        fill: 'red',
      },
      {
        as: 'circle',
        r: 50,
        cx: 150,
        cy: 50,
        fill: 'red',
      },
    ],
  },
]);

selection.append('rect');
