# D3 Render

Declarative and reusable D3. Replace `select`, `append`, `data`, `join`, `enter`, `exit`, `transition` and more with one function.

> Warning, highly experimental at this stage. API will change.

## Articles

- [Introducing D3 Render: Truly Declarative and Reusable D3](https://observablehq.com/@unkleho/introducing-d3-render-truly-declarative-and-reusable-d3).
- [COVID-19 Bubble Chart Tutorial](https://observablehq.com/@unkleho/covid-19-bubble-chart-with-d3-render)

## What's the difference?

Instead of imperative code:

```js
import * as d3 from 'd3';

// HTML file has an <svg> element
const svg = d3.select('svg');
svg
  .append('rect')
  .attr('fill', 'pink')
  .attr('x', 0)
  .attr('width', 100)
  .attr('height', 100);
```

Write declarative style like this:

```js
import render from 'd3-render';

const data = [{ append: 'rect', fill: 'pink', x: 0, width: 100, height: 100 }];

// HTML file has an <svg> element
render('svg', data);
```

## Getting Started

```bash
$ npm install d3-render d3-selection d3-transition
```

D3 Render needs `d3-selection` (>=1.4) and `d3-transition` (>=1) as peerDependencies.

## Documentation

### `Render`

One function to rule them all. To use, add this to your JavaScript or TypeScript file:

```js
import render from 'd3-render';

render(selector, data);

// Render also returns the full D3 selection for advanced use cases
const selection = render(selector, data);
```

`render` takes two arguments:

#### `selector`

A D3 selector string, HTML node or D3 selection to specify the root element where `render` will run. Works like a bit like [d3.select](https://github.com/d3/d3-selection#select). Most common usage is with an id or class.

```js
// Selects first <svg> element
render('svg', data);

// Select by id
render('#root', data);

// Select first element with this class name
render('.data-viz', data);

// Select by DOM node
const node = document.querySelector('.data-viz');
render(node, data);

// Select by D3 selection
const selection = d3.select('svg');
render(selection, data);

// Or called by D3
d3.select('svg').call(render, data);
```

#### `data`

An array of objects describing elements that D3 will append or update. For example:

```js
const data = [
  {
    append: 'circle',
    r: 50,
    cx: 50,
    cy: 50,
    fill: 'purple',
  },
  {
    append: 'rect',
    width: 100,
    height: 100,
    x: 100,
    y: 0,
    fill: 'blue',
  },
];

render('#root', data);
```

`render` uses this data to append two elements to `#root`, with the following result:

```html
<svg id="root">
  <circle r="50" cx="50" cy="50" fill="purple" />
  <rect width="100" height="100" x="100" y="0" fill="blue" />
</svg>
```

The D3 selection API is called for you, hiding imperative code like `selection.append()` or `selection.attr()`.

##### Nesting

`data` can be **hierarchical** in structure with the special `children` key.

Say we want to wrap the circle and rectangle above within a group element:

```js
const data = [
  {
    append: 'g',
    children: [
      {
        append: 'circle',
        ...
      },
      {
        append: 'rect',
        ...
      },
    ],
  },
];
```

`render` handles D3's nested appends for you and produces:

```html
<svg id="root">
  <g>
    <circle r="50" cx="50" cy="50" fill="purple" />
    <rect width="100" height="100" x="100" y="0" fill="blue" />
  </g>
</svg>
```

The `children` key can be applied to any element on any level, so you can deeply nest to your hearts content.

#### Element Keys

Below is a list of important element keys:

| Element Key                                                          | Description                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `append`\*                                                           | Any SVG or HTML element to append. eg. `rect`, `circle`, `path`, `g`, `div`, `img` and more. Runs D3's `selection.append()` behind the scenes.                                                                                                                                                                                                                                         |
| `key`                                                                | Unique identifier used to match elements on the same nesting level. Useful for transitions.                                                                                                                                                                                                                                                                                            |
| `class`                                                              | Class name of appended element                                                                                                                                                                                                                                                                                                                                                         |
| `id`                                                                 | Id of appended element                                                                                                                                                                                                                                                                                                                                                                 |
| `x`, `y`, `width`, `height`, `cx`, `cy`, `r`, `d`, `fillOpacity` etc | Any valid attribute and value for the appended SVG element. Same as using `selection.attr()`, but camel case the key, eg. `fillOpacity` instead of `fill-opacity`. Can optionally use `{ enter, exit }` for animation (but must have a `duration`). For example, to expand or contract height from `0` to `100px` when element enters or exits, use: `height: { enter: 100, exit: 0 }` |
| `text`                                                               | Text string to display in element. Only works for `text` elements. eg. `{ append: text, text: 'Greetings'}`                                                                                                                                                                                                                                                                            |
| `html`                                                               | String that is evaluated into html via `element.innerHTML`. Useful for inlined text formatting eg. `{ html: '<strong>Important</strong> normal'}`. Replaces any `children`.                                                                                                                                                                                                            |
| `style`                                                              | An object with style property keys and values. Keys are camel cased. eg. `style: { fillOpacity: 0.5 }`. Runs `selection.style()` in the background.                                                                                                                                                                                                                                    |
| `duration`                                                           | Number in milliseconds. Activates a D3 transition, setting the time it takes for the element to enter, update or exit. Calls `selection.transition().duration(myDuration)`.                                                                                                                                                                                                            |
| `delay`                                                              | Number in milliseconds. Delays the start of the transition.                                                                                                                                                                                                                                                                                                                            |
| `ease`                                                               | Sets the easing function for D3 transition. Use any D3 easing function [here](https://github.com/d3/d3-ease). eg. `{ append: 'rect', ease: d3.easeQuadInOut }`                                                                                                                                                                                                                         |
| `children`                                                           | Array of element objects, which will be nested under the current element.                                                                                                                                                                                                                                                                                                              |
| `onClick`, `onMouseOver`, `onMouseOut`, supports any `on*` event     | A function for element event. Function can be used like this: `{ onClick: (event, data, index) => {} }`                                                                                                                                                                                                                                                                                |
| `call`                                                               | A function with a D3 selection as the first argument. Useful for creating an axis or for advanced functionality, eg. `{ call: xAxis }`. Essentially runs `selection.call()`.                                                                                                                                                                                                           |

\* Required

## Updating Elements

To make updates to rendered elements, just run `render` again, but with a different `data` value. Add a duration value for a smooth transition.

```js
// Initial data
const data = [
  { append: 'ellipse', fill: 'red', rx: 100, ry: 50, duration: 1000 },
];

// Initial render on <svg id="#root"></svg>
render('#root', data);

// After two seconds, change ellipse to blue
setTimeout(() => {
  // Set some updated data
  const newData = [
    { append: 'ellipse', fill: 'blue', rx: 100, ry: 50, duration: 1000 },
  ];

  // Call render again
  render('#root', newData);
}, 2000);
```

Behind the scenes, `render` does a lot of heavy lifting for you. It binds your `data`, appends the ellipse and then rebinds the `newData` to trigger an update and transition. This is the equivalent vanilla D3 code:

```js
const data = [{ fill: 'red' }];
const svg = d3.select('#root');

function update(data) {
  svg
    .selectAll('ellipse')
    .data(data)
    .join(
      enter =>
        enter
          .append('ellipse')
          .attr('rx', 100)
          .attr('ry', 50)
          .attr('fill', d => d.fill),
      update =>
        update.call(update =>
          update
            .transition()
            .duration(1000)
            .attr('fill', d => d.fill)
        )
    );
}

update(data);

// After two seconds, turn ellipse blue
setTimeout(() => {
  update([{ fill: 'blue' }]);
}, 2000);
```

We are using d3-selection 1.4's `join` function, which is much easier to remember than the old [general update pattern](https://bl.ocks.org/mbostock/3808234/457c620cab92e5dc9b8351b31a572fe6eb7d51d7). This [article](https://observablehq.com/@d3/selection-join) from Mike Bostock explains `join` extremely well and is the underlying inspiration for our `render` function.

## Enter/Exit Elements

The `render` function not only tracks updated elements, but also new or removed elements since the last `data` change.

Here is a simple example below:

```js
// Build an svg with nothing in it
render('#root', []);
// Renders: <svg id="root"></svg>

// Two seconds later, re-render with a new rect element
setTimeout(() => {
  render('#root', [{ append: 'rect', width: 100, height: 100, fill: 'pink' }]);
  // Renders: <svg id="root"><text>Howdy there!</text></svg>

  // Two seconds after text element appears, remove it
  setTimeout(() => {
    render('#root', []);
    // Renders: <svg id="root"></svg>
  }, 2000);
}, 2000);
```

D3's data binding works much the same way. In fact, we are also data binding in the background, but we've also added some boilerplate to make enter/exit transitions easy to do.

### Enter/Exit Transition

Let's enable enter/exit transitions by adding two lines of code:

```js
render('#root', []);

setTimeout(() => {
  render('#root', [
    {
      append: 'rect',
      // Was width: 0
      width: { enter: 100, exit: 0 },
      height: 100,
      fill: 'pink',
      // Length of transition in milliseconds
      duration: 1000,
    },
  ]);

  setTimeout(() => {
    render('#root', []);
  }, 2000);
}, 2000);
```

The `width` has been changed to an object with an `enter` value, and `exit` value. When the `rect` enters, the width is `0`, it then takes 1 second (from `duration`) to animate to `100px`.

When the `rect` is removed from `data`, the exit transition kicks in, animating the width from `100px` to `0` in 1 second. The `rect` element is then removed from the DOM.

The `{ enter, exit }` animation object is a powerful pattern that can be applied to **any** attribute in the element.

### Event Handlers

An event handler for the element can be defined along with the rest of the attributes.

```js
render('#root', [
  {
    append: 'circle',
    r: 50,
    cx: 50,
    cy: 50,
    // Circle can call function when it is clicked or tapped
    onClick: (event, datum) => {},
    // Or when the mouse is over
    onMouseOver: (event, datum) => {},
  },
]);
```

Any `on*` event can be used eg. `onDrag`, `onScroll`, `onWheel` etc. D3 Render maps the declared event function to `selection.on()`.

### Inline Styles

An element can be styled inline with the `style` key and a `style` object value. Style properties must be in camel case.

```js
render('#root', [
  {
    append: 'rect',
    width: 50,
    height: 50,
    style: {
      fillOpacity: 0.5,
    },
  },
]);
```

### React Example

D3 Render is actually inspired by React's declarative mental model, so it is no suprise that integration between the two is quite simple:

```jsx
// App.js

import React from 'react';
import render from 'd3-render';

const App = () => {
  const svg = React.useRef();
  const [data, setData] = React.useState([
    {
      append: 'rect',
      width: 100,
      height: 100,
      fill: 'green',
      duration: 1000,
      // Add some interactivity to the <rect> element
      onClick: () => {
        setData([{ ...data[0], fill: 'yellow' }]);
      },
    },
  ]);

  React.useEffect(() => {
    if (svg && svg.current) {
      // Pass svg node to D3 render, along with data.
      // render runs whenever data changes
      render(svg.current, data);
    }
  }, [data]);

  return <svg ref={svg}></svg>;
};
```

## Todos

### Documentation

- [ ] Add animated gifs
- [x] Interactivity example
- [x] `update` example
- [x] `html` example
- [x] Nesting with `children` example
- [ ] Component example
- [ ] Data `key` example
- [ ] Selection return example
- [x] Incremental adoption example with `d3.select('svg').call(render, data)`
- [ ] Element node access in function value eg. `delay: function(d, i) { this.getTotalLength() }`

### API

- [x] Reduce bundle size by only requiring `d3-selection` and `d3-transition`
- [x] Merge `render` and `renderSelection` into one function
- [x] Add `style` attribute key
- [x] Use camelCased element keys and then convert to snake-case for selection.attr()
- [x] Add more on\* events
- [x] Try `selection.prototype = render` for `d3.render()` to work
- [x] Enable HTML element appends
- [x] Add tests
- [x] Integrate `selection.html()`
- [x] Add `update` to `{ enter, exit }` transition object
- [x] Consider `start` in transition object
- [x] Consider `{ enter, exit }` for `ease`, `delay` and `duration`
- [ ] Design declarative API for complex timeline based animations
- [ ] Remove transition if no duration

## Local Development

This project was bootstrapped with [TSDX](https://github.com/jaredpalmer/tsdx).

Below is a list of commands you will probably find useful.

### `npm start` or `yarn start`

Runs the project in development/watch mode. Your project will be rebuilt upon changes. TSDX has a special logger for you convenience. Error messages are pretty printed and formatted for compatibility VS Code's Problems tab.

Your library will be rebuilt if you make edits.

### `npm run build` or `yarn build`

Bundles the package to the `dist` folder.
The package is optimized and bundled with Rollup into multiple formats (CommonJS, UMD, and ES Module).

### `npm test` or `yarn test`

Runs the test watcher (Jest) in an interactive mode.
By default, runs tests related to files changed since the last commit.
