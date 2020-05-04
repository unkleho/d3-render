module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, options) {
    return {
      ...config,
      // TODO: Attempt at adding d3-render to d3.selection chain
      // https://github.com/d3/d3-transition/blob/master/rollup.config.js
      // external: ['d3-selection', 'd3-transition'],
      // output: {
      //   ...config.output,
      //   name: 'd3',
      //   extend: true,
      //   indent: false,
      //   globals: {
      //     'd3-selection': 'd3',
      //     'd3-transition': 'd3',
      //   },
      // },
    };
  },
};
