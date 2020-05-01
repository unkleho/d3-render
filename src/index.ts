import * as d3 from 'd3-selection';
import 'd3-transition';

type ElementDatum = {
  append: string;
  children?: ElementDatum[] | undefined;
  duration?: number | Function;
  delay?: number | Function;
  ease?: Function;
  [key: string]: number | string | object | Function | null | undefined;
};

export default function render(selector, data: ElementDatum[]) {
  const selection = d3.select(selector);

  return renderSelection(selection, data);
}

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
                addAttributes(selection, d, 'exit')
              );

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
          //   createElements(d3.select(this), d, level + 1);
          // });

          return exit.each(exitTransition);
        }
      )
  );
}

function addAttributes(selection, data, state) {
  // Assume anything other than key, text, onClick etc are attributes
  // TODO: Will need to keep adding to this list
  const {
    append,
    key,
    text,
    onClick,
    children,
    duration,
    delay,
    ease,
    ...attributes
  } = data;

  // Rather than hand coding every attribute, we loop over the attributes object
  for (const key in attributes) {
    let value;
    const attributeValue = attributes[key];

    // Every attribute value can have an optional exit/enter value
    // We just check if value is an object eg. { exit: 0, enter: 100 }
    if (typeof attributeValue === 'object') {
      value = attributeValue[state];
    } else {
      value = attributeValue;
    }

    selection.attr(key, value);
  }

  if (data.text) {
    selection.text(data.text);
  }

  // Can't do selection.on('click') for some stoopid reason, need to use .each
  selection.each(function(d) {
    if (typeof d.onClick === 'function') {
      d3.select(this).on('click', function(d, i) {
        // @ts-ignore
        d.onClick(d3.event, d, i);
      });
    }
  });

  return selection;
}

function addTransition(
  selection,
  datum: ElementDatum = { append: null },
  state = 'enter'
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

function getValue(value, state) {
  if (typeof value === 'object') {
    return value[state];
  }

  return value;
}

// function camelToKebab(string) {
//   return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
// }
