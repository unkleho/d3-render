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

| Element Key                                           | Description                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `as`\*                                                | Any SVG element to append. eg. `rect`, `circle`, `path`, or `g` and more. Runs D3's `selection.append()` behind the scenes. HTML elements will be coming in the future.                                                                                                                                      |
| `key`                                                 | Unique identifier used to match elements on the same nesting level. Useful for transitions.                                                                                                                                                                                                                  |
| `class`                                               | Class name attached to element eg. `<rect class="my-class">`                                                                                                                                                                                                                                                 |
| `id`                                                  | Id attached to element eg. `<ellipse id="my-class">`                                                                                                                                                                                                                                                         |
| `x`, `y`, `width`, `height`, `cx`, `cy`, `r`, `d` etc | Any valid attribute and value for the appended SVG element. Same as using `selection.attr()`. Can optionally use `{ enter, exit }` for animation (but must have a `duration`) . For example, to expand/contract height from `0` to `100px` when element enters/exits, use: `height: { enter: 100, exit: 0 }` |
| `text`                                                | Text string to display in element. Only works for `text` elements. eg. `{ as: text, text: 'Greetings'}`                                                                                                                                                                                                      |
| `duration`                                            | Number in milliseconds. Activates a D3 transition, setting the time it takes for the element to enter, update or exit. Calls `selection.transition().duration(myDuration)`.                                                                                                                                  |
| `ease`                                                | Sets the easing function for D3 transition. Use any D3 easing function [here](https://github.com/d3/d3-ease). eg. `{ as: 'rect', ease: d3.easeQuadInOut`                                                                                                                                                     |
| `children`                                            | Array of element objects, which will be nested under the current element.                                                                                                                                                                                                                                    |
| `onClick`                                             | Function to call when element is clicked or tapped. More interactive callbacks to come.                                                                                                                                                                                                                      |

\* Required

## Updating Elements

To make updates to rendered elements, just run `render` again, but with a different `data` value. Add a duration value for a smooth transition.

```js
// Initial data
const data = [{ as: 'ellipse', fill: 'red', rx: 100, ry: 50, duration: 1000 }];

// Initial render on <svg id="#root"></svg>
render('#root', data);

// After two seconds, change ellipse to blue
setTimeout(() => {
  // Set some updated data
  const newData = [
    { as: 'ellipse', fill: 'blue', rx: 100, ry: 50, duration: 1000 },
  ];

  // Call render again
  render('#root', newData);
}, 2000);
```

Behind the scenes, `render` does a lot of heavy lifting for you. It binds your `data`, appends the ellipse and then rebinds the `newData` to trigger an update and transistion. This is the equivalent vanilla D3 code:

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

// Two seconds later, re-render with a new text element
setTimeout(() => {
  render('#root', [{ as: 'rect', width: 100, height: 100, fill: 'pink' }]);
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
      as: 'rect',
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

## Todos

### Documentation

- [ ] Add animated gifs
- [ ] Interactivity example
- [ ] Nesting with `children` example
- [ ] Component example
- [ ] Data `key` example
- [ ] Selection return example
- [ ] Incremental adoption example with `renderSelection`
- [ ] React example

### API

- [ ] Enable HTML element appends
- [ ] Add `update` to `{ enter, exit }` transition object
- [ ] Add more on\* events
- [ ] Add `style` attribute key
- [ ] Consider `enterStart` and `exitStart` in transition object
- [ ] Integrate `selection.html()`
- [ ] Consider `{ enter, exit }` for `ease` and `duration`
- [ ] Design declarative API for complex timeline based animations

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
