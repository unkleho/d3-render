// import * as d3 from 'd3';

import render from '../';
// import render from 'd3-render';

const selection = render('#svg', [
  {
    append: 'g',
    children: [
      {
        append: 'rect',
        width: 100,
        height: 100,
        fill: 'red',
      },
      {
        append: 'circle',
        r: 50,
        cx: 150,
        cy: 50,
        fill: 'red',
      },
    ],
  },
]);

selection.append('rect');

// --------------------------------------------------------
// Update Test
// --------------------------------------------------------

function updateTest() {
  const data = [
    { append: 'ellipse', fill: 'red', rx: 100, ry: 50, duration: 1000 },
  ];

  // Initial render on <svg id="#root"></svg>
  render('#update-test', data);

  // After two seconds, change ellipse to blue
  setTimeout(() => {
    // Set some updated data
    const newData = [
      { append: 'ellipse', fill: 'blue', rx: 100, ry: 50, duration: 1000 },
    ];

    // Call render again
    render('#update-test', newData);
  }, 2000);
}

updateTest();
