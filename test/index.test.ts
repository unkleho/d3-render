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

  it('should render text element in svg with multiple attributes', () => {
    const svg = getExampleDOM('svg');

    const data = [
      {
        append: 'text',
        text: 'test',
        x: 5,
        y: 5,
        onClick: () => {},
      },
    ];

    render(svg, data);

    expect(svg.nodeName).toEqual('SVG');
    expect(svg.querySelector('text')).toBeTruthy();
    expect(getByText(svg, 'test')).toBeTruthy();

    data.forEach(d => {
      Object.keys(d).map(key => {
        const keyType = getKeyType(key);

        if (keyType === 'attribute') {
          const realValue = d[key];
          const testValue = svg.querySelector('text').getAttribute(key);

          expect(testValue).toEqual(realValue.toString());
        }
      });
    });
  });

  it("should render rect of class 'rect1' with inline styles", () => {
    const svg = getExampleDOM('svg');

    const data = [
      {
        append: 'rect',
        class: 'rect1',
        fill: 'red',
        style: {
          stroke: 'black',
          fillOpacity: 0.5,
        },
      },
    ];

    render(svg, data);

    const rect = svg.querySelector('.rect1');

    expect(rect.getAttribute('style')).toEqual(
      'stroke: black; fill-opacity: 0.5;'
    );
  });
});

// TODO:
// Test children and nesting
// Test id
// Test onClick etc
// Test styles
// Test { enter, exit } transition object
// Test function attribute value

function getKeyType(key: string) {
  if (['append', 'text', 'style'].includes(key)) {
    return key;
  } else if (key.startsWith('on')) {
    return 'handler';
  }

  return 'attribute';
}
