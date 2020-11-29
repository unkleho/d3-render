import * as d3 from 'd3';

import render from '../';

/**
 * Append Test
 */
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

/**
 * Update Test
 */
function updateTest() {
  const data = [
    {
      append: 'ellipse',
      fill: 'red',
      // TODO: Not quite working
      // rx: { enter: 50, start: 25, exit: 50 },
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

/**
 * Enter, Update, Exit Test
 */
function enterUpdateExitTest() {
  const startData = [];

  const enterData = [
    {
      append: 'rect',
      fill: 'orange',
      x: 0,
      width: { start: 0, enter: 50 },
      height: 50,
      duration: 200,
    },
  ];

  const updateData = [
    {
      append: 'rect',
      fill: 'green',
      x: { enter: 50, exit: 100 },
      width: { enter: 50, exit: 0 },
      height: { enter: 50, update: 40, exit: 50 },
      duration: { update: 1000, exit: 200 },
    },
  ];

  const dataArray = [startData, enterData, updateData];

  let i = 3;

  render('#enter-update-exit-test', enterData);

  setInterval(() => {
    const index = i % 3;
    const data = dataArray[index];

    render('#enter-update-exit-test', data);

    i++;
  }, 2000);
}

enterUpdateExitTest();

/**
 * Enter Test
 */
function enterTest() {
  const data = [
    {
      append: 'rect',
      width: {
        start: 0,
        enter: 50,
        exit: 50,
      },
      height: {
        start: 50,
        enter: 50,
        exit: 0,
      },
      fill: { start: 'yellow', enter: 'red', exit: 'purple' },
      duration: { enter: 1000, exit: 500 },
      ease: { enter: d3.easeBounceOut, exit: d3.easeBounceIn },
      // TODO: Get this working!
      // onTransitionStart: () => {
      //   return 'Start';
      // },
    },
    {
      append: 'rect',
      x: 51,
      width: {
        start: 0,
        enter: 50,
        exit: 50,
      },
      height: {
        start: 50,
        enter: 50,
        exit: 0,
      },
      fill: { start: 'yellow', enter: 'red', exit: 'purple' },
      delay: 200,
      // delay: { enter: 200, exit: 0 },
      duration: { enter: 1000, exit: 500 },
      ease: { enter: d3.easeBounceOut, exit: d3.easeBounceIn },
    },
  ];

  let i = 0;

  const interval = setInterval(() => {
    if (i < 11) {
      render('#enter-test', i % 2 ? [] : data);

      i++;
    } else {
      clearInterval(interval);
    }
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
      y: function() {
        return 8;
      },
      fontSize: 8,
    },
    {
      append: 'text',
      text: 'Test fillOpacity',
      fillOpacity: '0.5',
      y: 24,
      fontSize: 8,
    },
  ]);
}

selectionTest();

/**
 * Style Test
 * Check if `render` can accept a D3 selection
 */
function styleTest() {
  render('#style-test', [
    {
      append: 'rect',
      width: 50,
      height: 50,
      fill: 'black',
      style: {
        fillOpacity: 0.5,
      },
    },
  ]);
}

styleTest();

/**
 * HTML Test
 */
function htmlTest() {
  render('#html-test', [
    {
      append: 'div',
      html: '<strong>html</strong><br/><em>test</em>',
    },
  ]);
}

htmlTest();

/**
 * onClick test
 */
function onClickTest() {
  render('#on-click-test', [
    {
      append: 'rect',
      width: 50,
      height: 50,
      fill: 'orange',
      onClick: (event, d, i) => {
        console.log(event, d, i);
      },
      onMouseOver: (event, d, i) => {
        console.log(event, d, i);
      },
    },
  ]);
}

onClickTest();

/**
 * Div Test
 */
function divTest() {
  render('#div-test', [
    {
      append: 'div',
      style: {
        backgroundColor: 'red',
      },
      text: 'I am in a div!',
    },
  ]);
}

divTest();

/**
 * Button Test
 */
let buttonCounter = 0;
function buttonTest() {
  render('#button-test', [
    {
      append: 'button',
      text: `Clicked ${buttonCounter} times`,
      onClick: () => {
        buttonCounter++;
        buttonTest();
      },
    },
  ]);
}

buttonTest();

/**
 * Marker Test for camel case attribute exceptions
 */
function markerTest() {
  render('#marker-test', [
    {
      append: 'defs',
      children: [
        {
          append: 'marker',
          id: 'marker-start',
          // Ensure this shows up as
          // <marker markerWidth="8"> in HTML and so on...
          markerWidth: 8,
          markerHeight: 8,
          refX: 5,
          refY: 5,
          children: [
            {
              append: 'circle',
              cx: 5,
              cy: 5,
              r: 3,
              style: {
                fill: '#000000',
              },
            },
          ],
        },
      ],
    },
    {
      append: 'path',
      d: 'M10,10 L50,10',
      style: {
        stroke: '#000',
        strokeWidth: '1px',
        fill: 'none',
        markerStart: 'url(#marker-start)',
      },
    },
  ]);
}

markerTest();

/**
 * Render Chain Test
 * Check if `render` can accept a D3 selection
 * TODO: In progress
 */
// function renderChainTest() {
//   const svg = d3.select('#render-chain-test').render([
//     {
//       append: 'text',
//       text: 'render from d3.select',
//       y: 8,
//       'font-size': 8,
//     },
//   ]);
// }

// renderChainTest();
