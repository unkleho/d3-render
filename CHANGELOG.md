# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2021-02-17

- Update to use D3 v6 and selection/transition to v2. Thanks to @Cgg.

## [0.2.5] - 2020-11-29

- Add exceptions for camel to kebab case conversions for certain SVG attributes. Eg `markerWidth` and `markerHeight` have to be camel case.

## [0.2.4] - 2020-05-17

- Add `update` transition state for all attributes and animation values

## [0.2.3] - 2020-05-16

- Add `call` key, with test and example

## [0.2.2] - 2020-05-16

- Fix issues with empty `data` or `data` with `null` values

## [0.2.1] - 2020-05-10

- Enable HTML elements to be appended
- Install `@testing-library/dom` and add tests to cover most uses cases
- Add `start` key to transition object for initial transition value
- Add transition object to `duration` and `ease` for more enter/exit animation control
- Add `html` key

## [0.2.0] - 2020-05-05

- Replacec `d3` with `d3-selection` and `d3-transition` as peerDependencies to reduce bundle sizes
- Enable `render` to accept D3 `Selection` as selector
- Enable `camelCase` keys in `data` elements, eg. `fillOpacity` rather than `'fill-opacity'`
- Enable `style` key in `data` elements, calling `selection.style()` behind the scenes
- Enable any `on*` events, eg. `onClick`, `onMouseOver`
- Improve `render`'s way of attaching events, with a cleaner method that attaches before enter transition
- Update readme
- Attempt adding `render` to D3's selection chain (not working yet)

## [0.1.5] - 2020-04-29

- Add `unpkg` to `package.json` for easier use with ObservableHQ
- Add `delay` element key for more transition control

## [0.1.4] - 2020-04-28

- Change data element key `as` to `append` to match D3's append()

## [0.1.3] - 2020-04-24

- Enable UMD build output on prepare

## [0.1.2] - 2020-04-24

- Enable UMD build output

## [0.1.1] - 2020-04-24

- Create `render` function

## [0.1.0] - 2020-04-20

- Initial commit
