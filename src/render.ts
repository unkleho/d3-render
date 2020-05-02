import * as d3 from 'd3-selection';
import 'd3-transition';

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

export default function render(selector, data: ElementDatum[]) {
  if (selector.constructor.name === 'Selection') {
    return renderSelection(selector, data);
  }

  const selection = d3.select(selector);

  return renderSelection(selection, data);
}

function renderSelection(selection, data: ElementDatum[], level = 0) {
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
            .append(d =>
              // Yes you saw that right. Append element based on 'append' key in data.
              // Makes this whole function incredibly flexible
              // @ts-ignore
              document.createElementNS(d3.namespace('svg').space, d.append)
            )
            .each(function(d) {
              // Hook into things like selection.call(xAxis)
              if (typeof d.call === 'function') {
                d.call(d3.select(this), d);
              }

              // Add initial attributes. For now, initial and exit values are the same
              d3.select(this).call(selection =>
                addAttributes(selection, d, 'exit', this)
              );

              // Add enter transitions
              d3.select(this).call(selection =>
                addTransition(selection, d, 'enter', this)
              );

              // Recursively run again, passing in each child in selection
              renderSelection(d3.select(this), d.children, level + 1);
            });
        },
        update => {
          return update.each(function(d) {
            d3.select(this).call(selection =>
              addTransition(selection, d, 'enter', this)
            );

            renderSelection(d3.select(this), d.children, level + 1);
          });
        },
        exit => {
          // Important magic sauce to exit all descendent children
          exit.selectAll('*').each(exitTransition);

          // NOTE: This doesn't seem to work, but '*' above will do for now
          // exit.each(function(d) {
          //   createElements(d3.select(this), d, level + 1);
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
  state: TransitionState,
  node = null
) {
  // Assume anything other than key, text, onClick etc are attributes
  // TODO: Will need to keep adding to this list
  const {
    append,
    key,
    text,
    style,
    children,
    duration,
    delay,
    ease,
    onClick,
    ...attributes
  } = datum;

  // Rather than hand coding every attribute, we loop over the attributes object
  for (const key in attributes) {
    const attributeValue = attributes[key];
    const value = getValue(attributeValue, state);

    selection.attr(camelToKebab(key), value);
  }

  if (datum.text) {
    selection.text(datum.text);
  }

  if (datum.style) {
    selection = addStyles(selection, datum.style, state);
  }

  // Can't do selection.on('click') for some stoopid reason, need to use .each
  selection.each(function(d) {
    if (typeof d.onClick === 'function') {
      d3.select(this).on('click', function(d, i) {
        // @ts-ignore
        d.onClick(d3.event, d, i, node);
      });
    }
  });

  return selection;
}

function addStyles(selection, styles: ElementStyles, state: TransitionState) {
  for (const key in styles) {
    const styleValue = styles[key];
    const value = getValue(styleValue, state);

    selection.style(camelToKebab(key), value);
  }

  return selection;
}

function addTransition(
  selection,
  datum: ElementDatum = { append: null },
  state: TransitionState = 'enter',
  node = null
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
    .call(selection => addAttributes(selection, datum, state, node));
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

function camelToKebab(string: string): string {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}
