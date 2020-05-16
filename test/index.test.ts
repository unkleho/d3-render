import {
  // getByLabelText,
  getByText,
  // getByTestId,
  // queryByTestId,
  // Tip: all queries are also exposed on an object
  // called "queries" which you could import here as well
  // waitFor,
  fireEvent,
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

  it("should render group of id '#group1' with children", () => {
    const svg = getExampleDOM('svg');
    const data = [
      {
        append: 'g',
        id: 'group1',
        children: [
          {
            append: 'circle',
            r: 10,
          },
        ],
      },
    ];

    render(svg, data);

    const group = svg.querySelector('#group1');
    const circle = group.querySelector('circle');

    expect(circle).toBeTruthy();
    expect(circle.getAttribute('r')).toEqual('10');
  });

  it('should render rect with initial width from transition object', () => {
    const svg = getExampleDOM('svg');

    const data = [
      {
        append: 'rect',
        width: { enter: 100, exit: 0 },
      },
    ];

    render(svg, data);

    const rect = svg.querySelector('rect');
    expect(rect.getAttribute('width')).toEqual('0');
  });

  it('should render rect with an onClick handler', () => {
    const svg = getExampleDOM('svg');
    const onClick = jest.fn();
    const data = [
      {
        append: 'rect',
        width: 100,
        height: 100,
        onClick,
      },
    ];

    render(svg, data);

    const rect = svg.querySelector('rect');
    fireEvent(rect, new MouseEvent('click'));
    expect(onClick).toBeCalledWith(
      expect.objectContaining({
        isTrusted: false,
      }),
      expect.objectContaining({
        append: 'rect',
      }),
      0
    );
  });

  it('should render ellipse with a function attribute value', () => {
    const svg = getExampleDOM('svg');
    const rxMock = jest.fn();
    const data = [
      {
        append: 'ellipse',
        rx: (d, i) => {
          rxMock(d, i);
          return 100;
        },
        ry: 50,
      },
    ];

    render(svg, data);

    const ellipse = svg.querySelector('ellipse');
    expect(ellipse.getAttribute('rx')).toEqual('100');
    expect(rxMock).toBeCalledWith(data[0], 0);
  });

  it('should render div with text', () => {
    const body = getExampleDOM('body');
    const data = [
      {
        append: 'div',
        text: 'Text in div',
      },
    ];

    render(body, data);
    const div = body.querySelector('div');

    expect(div).toBeTruthy();
    expect(getByText(body, 'Text in div')).toBeTruthy();
  });

  it('should render div with html', () => {
    const body = getExampleDOM('body');
    const data = [
      {
        append: 'div',
        html: '<p>Text in paragraph</p>',
      },
    ];

    render(body, data);
    const div = body.querySelector('div');
    const paragraph = div.querySelector('p');

    expect(paragraph).toBeTruthy();
    expect(getByText(paragraph, 'Text in paragraph')).toBeTruthy();
  });

  it('should render data with null values', () => {
    const body = getExampleDOM('body');
    const data = [null];

    // @ts-ignore
    render(body, data);
    // const div = body.querySelector('div');
    // const paragraph = div.querySelector('p');

    expect(body).toBeTruthy();
  });

  it('should render data with a call function', () => {
    const mockCall = jest.fn();
    const svg = getExampleDOM('svg');
    const data = [
      {
        append: 'g',
        call: mockCall,
      },
    ];

    render(svg, data);
    const g = svg.querySelector('g');

    expect(g).toBeTruthy();
    expect(mockCall).toBeCalledWith({ _groups: [[g]], _parents: [null] });
  });
});

function getKeyType(key: string) {
  if (['append', 'text', 'style'].includes(key)) {
    return key;
  } else if (key.startsWith('on')) {
    return 'handler';
  }

  return 'attribute';
}
