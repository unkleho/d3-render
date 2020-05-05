import {
  // getByLabelText,
  getByText,
  // getByTestId,
  // queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  // waitFor,
} from '@testing-library/dom';

import render from '../src';

function getExampleDOM(element = 'svg') {
  return document.createElement(element);
}

describe('Render', () => {
  it('should return empty selection', () => {
    expect(render('.test', [])).toEqual({ _groups: [], _parents: [] });
  });

  it('should render svg', () => {
    const svg = getExampleDOM();

    render(svg, [
      {
        append: 'text',
        text: 'test',
        x: 5,
      },
    ]);

    expect(getByText(svg, 'test')).toBeTruthy();
    expect(svg.querySelector('text')).toBeTruthy();
    console.log(svg.querySelector('text').getAttribute('x'));
  });
});
