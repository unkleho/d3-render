# D3 Render

> Warning, highly experimental at this stage. API will change.

Declarative and reusable D3. Replace D3's `select`, `append`, `data`, `join`, `enter`, `exit`, `transition` and more with one function.

More detail in in this article: [Introducing D3 Render: Truly Declarative and Reusable D3](https://observablehq.com/d/919e2f0cb6db41fe).

So what's the difference? Instead of imperative code:

```js
import * as d3 from 'd3';

// Assume your HTML file has an <svg> element
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

const data = [{ as: 'rect', fill: 'pink', x: 0, width: 100, height: 100 }];

// Assume your HTML file has an <svg> element
render('svg', data);
```

## Getting Started

```bash
$ npm install d3-render d3
```

D3 Render has no dependencies, however it requires D3 version >=5 to be a peer dependency.

## Documentation

### `Render`

Pretty much one function to rule them all. To use, add this to your JavaScript or TypeScript file:

```js
import render from 'd3-render';

render(selector, data);

// Render also returns the full D3 selection for advanced use cases
const selection = render(selector, data);
```

`render` takes two arguments:

#### `selector`

A D3 selector string or node to specify the root element where `render` will run. Works exactly the same as [d3.select](https://github.com/d3/d3-selection#select). Most common usage is with an id or class.

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
```

#### `data`

An array of objects describing elements that D3 will append or update. For example:

```js
const data = [
  {
    as: 'circle',
    r: 50,
    cx: 50,
    cy: 50,
    fill: 'purple',
  },
  {
    as: 'rect',
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

`data` can be **hierarchical** in structure with the special `children` key.

Say we want to wrap the circle and rectangle above within a group element:

```js
const data = [
  {
    as: 'g',
    children: [
      {
        as: 'circle',
        ...
      },
      {
        as: 'rect',
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

| Element Key                     | Description                                                                                                                                                                 |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`\*                          | Any SVG element to append. Runs D3's `selection.append()` behind the scenes. HTML elements will be coming in the future.                                                    |
| `key`                           | Unique identifier used to match elements on the same nesting level. Useful for transitions.                                                                                 |
| `class`                         | Class name attached to element eg. `<rect class="my-class">`                                                                                                                |
| `id`                            | Id attached to element eg. `<ellipse id="my-class">`                                                                                                                        |
| `x`, `y`, `width`, `height` etc | Any valid attribute for the appended SVG element. Same as using `selection.attr('x', 0)` or `selection.attr('width', 100)`                                                  |
| `duration`                      | Number in milliseconds. Activates a D3 transition, setting the time it takes for the element to enter, update or exit. Calls `selection.transition().duration(myDuration)`. |
| `ease`                          | Sets the easing function for D3 transition. Use any D3 easing function [here](https://github.com/d3/d3-ease). eg. `{ as: 'rect', ease: d3.easeQuadInOut`                    |
| `children`                      | Array of element objects, which will be nested under the current element.                                                                                                   |
| `onClick`                       | Function to call when element is clicked or tapped. More interactive callbacks to come.                                                                                     |

\* Required

## Updates

Todo.

## Enter/Exit

Todo.

## Interactivity

Todo.

## Nesting

Todo.

## Components

Todo.

## Advanced

Todo.

### No data key?

### Selection return example

Todo.

### Can be Incrementally adopted

Todo.

#### `renderSelection`

## Examples

Todo.

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
