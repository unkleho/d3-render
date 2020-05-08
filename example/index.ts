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
 * Enter Test
 */
function enterTest() {
  const data = [
    {
      append: 'rect',
      width: {
        enter: 50,
        // enter: (d, i, node) => {
        //   console.log(d, i, node);

        //   return 50;
        // },
        exit: 0,
      },
      height: 50,
      fill: 'red',
      duration: 1000,
      ease: d3.easeBounceInOut,
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
      y: 8,
      'font-size': 8,
    },
    {
      append: 'text',
      text: 'Test fillOpacity',
      fillOpacity: '0.5',
      y: 24,
      'font-size': 8,
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
function buttonTest(counter = 0) {
  render('#button-test', [
    {
      append: 'button',
      text: `Clicked ${counter} times`,
      onClick: () => buttonTest(counter++),
    },
  ]);
}

buttonTest();

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
