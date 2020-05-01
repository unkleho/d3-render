import * as d3 from 'd3';

import render from '../';
// import render from 'd3-render';

// --------------------------------------------------------
// Append Test
// --------------------------------------------------------

function appendTest() {
  const selection = render('#append-test', [
    {
      append: 'g',
      children: [
        {
          append: 'rect',
          width: 50,
          height: 50,
          fill: 'red',
        },
        {
          append: 'circle',
          r: 25,
          cx: 75,
          cy: 25,
          fill: 'red',
        },
      ],
    },
  ]);

  selection.append('rect');
}

appendTest();

// --------------------------------------------------------
// Update Test
// --------------------------------------------------------

function updateTest() {
  const data = [
    {
      append: 'ellipse',
      fill: 'red',
      rx: 50,
      ry: 25,
      cx: 50,
      cy: 25,
      duration: 1000,
    },
  ];

  render('#update-test', data);

  // After two seconds, change ellipse to blue
  setTimeout(() => {
    // Set some updated data
    const newData = [
      { append: 'ellipse', fill: 'blue', rx: 50, ry: 25, duration: 1000 },
    ];

    // Call render again
    render('#update-test', newData);
  }, 2000);
}

updateTest();

// --------------------------------------------------------
// Enter Test
// --------------------------------------------------------

function enterTest() {
  const data = [
    {
      append: 'rect',
      width: { enter: 50, exit: 0 },
      height: 50,
      fill: 'red',
      duration: 1000,
      ease: d3.easeBounceInOut,
    },
  ];

  let i = 0;

  setInterval(() => {
    render('#enter-test', i % 2 ? [] : data);

    i++;
  }, 2000);
}

enterTest();

/**
 * Selection Test
 * Check if `render` can accept a D3 selection
 */
function selectionTest() {
  const svg = d3.select('#selection-test');

  render(svg, [
    {
      append: 'text',
      text: 'render from d3.select',
      y: 8,
      'font-size': 8,
    },
  ]);
}

selectionTest();
