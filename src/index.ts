import { selection } from 'd3-selection';
import render, { renderSelection } from './render';

// TODO: Attempt at chaining render
function chainedRender(data) {
  return render(this, data);
}

selection.prototype.render = chainedRender;

export default render;
export { renderSelection };
