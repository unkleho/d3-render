import * as d3 from 'd3-selection';
import 'd3-transition';

import getNamespace from './getNamespace';

type ElementDatum = {
  append: string;
  children?: ElementDatum[];
  duration?: number | Function;
  delay?: number | Function;
  ease?: Function;
  style?: ElementStyles;
  [key: string]: number | string | object | Function;
};

type ElementStyles = {
  [key: string]: number | string | object | Function;
};

type TransitionState = 'enter' | 'exit';

// type Selector = string | Node;

/**
 * Using D3, this function renders elements based on declarative `data`, effectively replacing `select`, `append`, `data`, `join`, `enter`, `exit`, `transition` and more.
 * @param selector
 * @param data
 */
export default function render(selector, data: ElementDatum[]) {
  // Crude way to check if `selector` is a D3 selection
  if (typeof selector === 'object' && selector._groups && selector._parents) {
    return renderSelection(selector, data);
  }

  const selection = d3.select(selector);

  return renderSelection(selection, data);
}

/**
 * Recursively renders elements based on `data`, which can be deeply nested with the `children` key.
 */
export function renderSelection(selection, data: ElementDatum[], level = 0) {
  return (
    selection
      // Cool way to select immediate children. (Totally didn't know you could do this)
      .selectAll((_, i, nodes) => {
        return nodes[i].children;
      })
      .data(data, (d, i) => d.key || i)
      .join(
        enter => {
          return enter
            .append(d => {
              // Yes you saw that right. Append element based on 'append' key in data.
              // Makes this whole function incredibly flexible
              const namespace = getNamespace(d.append);

              // https://stackoverflow.com/questions/51857699/append-shapes-dynamically-in-d3
              return document.createElementNS(
                // @ts-ignore
                d3.namespace(namespace).space,
                d.append
              );
            })
            .each(function(d) {
              // Hook into things like selection.call(xAxis)
              if (typeof d.call === 'function') {
                d.call(d3.select(this), d);
              }

              // Add initial attributes. For now, initial and exit values are the same
              d3.select(this).call(selection =>
                addAttributes(selection, d, 'exit')
              );

              // Add events to element eg. onClick
              d3.select(this).call(selection => addEvents(selection, d));

              // Add enter transitions
              d3.select(this).call(selection =>
                addTransition(selection, d, 'enter')
              );

              // Recursively run again, passing in each child in selection
              renderSelection(d3.select(this), d.children, level + 1);
            });
        },
        update => {
          return update.each(function(d) {
            d3.select(this).call(selection =>
              addTransition(selection, d, 'enter')
            );

            renderSelection(d3.select(this), d.children, level + 1);
          });
        },
        exit => {
          // Important magic sauce to exit all descendent children
          exit.selectAll('*').each(exitTransition);

          // NOTE: This doesn't seem to work, but '*' above will do for now
          // exit.each(function(d) {
          //   renderSelection(d3.select(this), d, level + 1);
          // });

          return exit.each(exitTransition);
        }
      )
  );
}

/**
 * Add attributes to element node
 * @param selection
 * @param datum
 * @param state
 */
function addAttributes(
  selection,
  datum: ElementDatum,
  state: TransitionState
  // node = null
) {
  // Assume anything other than key, text etc are attributes
  const {
    append,
    key,
    text,
    style,
    children,
    duration,
    delay,
    ease,
    ...attributes
  } = datum;

  // Rather than hand coding every attribute, we loop over the attributes object
  for (const key in attributes) {
    const attributeValue = attributes[key];
    const value = getValue(attributeValue, state);
    const isEvent = key.indexOf('on') === 0;

    // Skip any on* events, we'll handle them in addEvents
    if (!isEvent) {
      selection.attr(camelToKebab(key), value);
    }
  }

  if (datum.text) {
    selection.text(datum.text);
  }

  if (datum.style) {
    selection = addStyles(selection, datum.style, state);
  }

  return selection;
}

/**
 * Add event to selection element
 * @param selection
 * @param datum
 */
function addEvents(selection, datum) {
  // Loop throught all keys in datum
  for (const key in datum) {
    const isEvent = key.indexOf('on') === 0;

    // Only allow keys with on*
    if (isEvent) {
      const callback = datum[key];

      // Check that the value is a callback function
      if (typeof callback === 'function') {
        const eventName = key.replace('on', '').toLowerCase();

        selection.on(eventName, function(d, i) {
          return callback(d3.event, d, i);
        });
      }
    }
  }

  return selection;
}

/**
 * Adds inline styles to the element
 * @param selection
 * @param styles
 * @param state
 */
function addStyles(selection, styles: ElementStyles, state: TransitionState) {
  for (const key in styles) {
    const styleValue = styles[key];
    const value = getValue(styleValue, state);

    selection.style(camelToKebab(key), value);
  }

  return selection;
}

/**
 * Add transition to element, animating to a particular `state` by updating
 * selection with `addAttributes`
 * @param selection
 * @param datum
 * @param state
 */
function addTransition(
  selection,
  datum: ElementDatum = { append: null },
  state: TransitionState = 'enter'
) {
  let transition = selection
    .transition()
    .delay(d => getValue(d.delay, state) || 0)
    .duration(getDuration);

  if (typeof datum.ease === 'function') {
    transition = transition.ease(t => datum.ease(t));
  }

  if (state === 'exit') {
    transition = transition.remove();
  }

  return selection
    .transition(transition)
    .call(selection => addAttributes(selection, datum, state));
}

function exitTransition(d) {
  d3.select(this).call(selection => addTransition(selection, d, 'exit'));
}

function getDuration(d) {
  return d.duration;
}

/**
 * Get value from ElementDatum key, process and pass to selection.attr(),
 * selection.transition() or selection.style()
 * Every value can have an optional exit/enter value
 * We just check if value is an object eg. { exit: 0, enter: 100 }
 * @param value
 * @param state
 */
function getValue(value, state: TransitionState): number | string | Function {
  if (typeof value === 'object') {
    return value[state];
  }

  return value;
}

/**
 * Convert camelCase to kebab-case for JavaScript to HTML/CSS interop
 * @param string
 */
function camelToKebab(string: string): string {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
