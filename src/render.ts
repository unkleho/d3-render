import * as d3 from 'd3-selection';
import 'd3-transition';

import getNamespace from './getNamespace';

type ElementDatum = {
  append: string;
  children?: ElementDatum[];
  duration?: number | Function | TransitionObject;
  delay?: number | Function | TransitionObject;
  ease?: Function | TransitionObject;
  style?: ElementStyles;
  call?: Function;
  [key: string]: ElementValue;
};

type ElementValue = number | string | Function | object;

type ElementStyles = {
  [key: string]: number | string | Function | object;
};

type TransitionState = 'start' | 'enter' | 'update' | 'exit';

// TODO: Causes type errors on style and children
type TransitionObject = {
  start?: number | string | Function;
  update?: number | string | Function;
  enter: number | string | Function;
  exit?: number | string | Function;
};

// type Selector = string | Node;

// TODO: Consider incorporating element types from:
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts

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
  if (!Boolean(data)) {
    return selection;
  }

  return (
    selection
      // Cool way to select immediate children. (Totally didn't know you could do this)
      .selectAll((_, i, nodes) => {
        return nodes[i].children;
      })
      .data(
        // Ensure all data elements are okay
        data.filter(d => Boolean(d)),
        (d, i) => d?.key || i
      )
      .join(
        enter => {
          return enter
            .append(d => {
              // Yes you saw that right. Append element based on 'append' key in data.
              // Makes this whole function incredibly flexible
              const namespace = getNamespace(d.append);

              if (namespace === 'html') {
                return document.createElement(d.append);
              }

              // https://stackoverflow.com/questions/51857699/append-shapes-dynamically-in-d3
              return document.createElementNS(
                // @ts-ignore
                d3.namespace(namespace).space,
                d.append
              );
            })
            .each(function(d) {
              const element = d3.select(this);

              // Hook into things like selection.call(xAxis)
              if (typeof d.call === 'function') {
                d.call(element);
              }

              // Add initial attributes. For now, initial and exit values are the same
              element.call(selection => addAttributes(selection, d, 'start'));

              // Add HTML
              if (d.html) {
                element.html(d.html);
              }

              // Add events to element eg. onClick
              element.call(selection => addEvents(selection, d));

              // Add enter transitions
              element.call(selection => addTransition(selection, d, 'enter'));

              // element.call(selection =>
              //   addEvents(selection, d, 'onTransition')
              // );

              // Recursively run again, passing in each child in selection
              renderSelection(element, d.children, level + 1);
            });
        },
        update => {
          return update.each(function(d) {
            const element = d3.select(this);
            element.call(selection => addTransition(selection, d, 'update'));

            renderSelection(element, d.children, level + 1);
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
    call,
    key,
    text,
    html,
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
      selection.attr(keyToAttribute(key), value);
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
function addEvents(selection, datum, onPrefix = 'on') {
  // Loop throught all keys in datum
  for (const key in datum) {
    const isEvent = key.indexOf(onPrefix) === 0;

    // Only allow keys with on*
    if (isEvent) {
      const callback = datum[key];

      // Check that the value is a callback function
      if (typeof callback === 'function') {
        const eventName = key.replace(onPrefix, '').toLowerCase();

        selection.on(eventName, function(e, d) {
          return callback(e, d);
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
  datum: ElementDatum,
  state: TransitionState = 'enter'
) {
  const duration = getValue(datum.duration, state);

  if (!Boolean(datum)) {
    return selection;
  }

  const delay = getValue(datum.delay, state) || 0;
  const ease = getValue(datum.ease, state);

  let transition = selection
    .transition()
    .delay(delay)
    .duration(duration);

  if (typeof ease === 'function') {
    transition = transition.ease(t => ease(t));
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
    const newValue = value[state];

    // Default to `exit` if `start` value not available
    // Assume that element will start the same way it exits
    if (state === 'start' && isEmpty(newValue)) {
      return value['exit'];
    }

    // Default to `enter` if `update` value not available
    if (state === 'update' && isEmpty(newValue)) {
      return value['enter'];
    }

    return newValue;
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

/**
 * Convert key to HTML attribute. Most keys will change from camel to kebab
 * case, except for certain SVG attributes.
 * @param string
 */
function keyToAttribute(key: string): string {
  if (
    [
      'allowReorder',
      'attributeName',
      'attributeType',
      'autoReverse',
      'baseFrequency',
      'baseProfile',
      'calcMode',
      'clipPathUnits',
      'contentScriptType',
      'contentStyleType',
      'diffuseConstant',
      'edgeMode',
      'externalResourceRequired',
      'filterRes',
      'filterUnits',
      'glyphRef',
      'gradientTransform',
      'gradientUnits',
      'kernelMatrix',
      'kernelUnitLength',
      'keyPoints',
      'keySplines',
      'keyTimes',
      'lengthAdjust',
      'limitingConeAngle',
      'markerHeight',
      'markerUnits',
      'markerWidth',
      'maskContentUnits',
      'maskUnits',
      'numOctaves',
      'pathLength',
      'patternContentUnits',
      'patternTransform',
      'patternUnits',
      'pointsAtX',
      'pointsAtY',
      'pointsAtZ',
      'preserveAlpha',
      'preserveAspectRatio',
      'primitiveUnits',
      'referrerPolicy',
      'refX',
      'refY',
      'repeatCount',
      'repeatDur',
      'requiredExtensions',
      'requiredFeatures',
      'specularConstant',
      'specularExponent',
      'spreadMethod',
      'startOffset',
      'stdDeviation',
      'stitchTiles',
      'surfaceScale',
      'systemLanguage',
      'tableValues',
      'targetX',
      'targetY',
      'textLength',
      'viewBox',
      'xChannelSelector',
      'yChannelSelector',
      'zoomAndPan',
    ].includes(key)
  ) {
    return key;
  }

  return camelToKebab(key);
}

function isEmpty(value) {
  return value == null;
}
