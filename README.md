# D3 Render

> Warning, highly experimental at this stage. API will change.

Declarative and reusable D3. Replace selects, appends, joins, data, transitions and more with one function:

```js
import render from 'd3-render';

const data = [
  { as: 'rect', fill: 'pink', x: 0, width: 100, height: 100 }
];

// Assume your html file has an <svg> element
render('svg', data);
```

More detail in in this article: [Introducing D3 Render: Truly Declarative and Reusable D3](https://observablehq.com/d/919e2f0cb6db41fe).

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
