import { selection } from 'd3-selection';
import render from './render';

function chainedRender(data) {
  return render(this, data);
}

selection.prototype.render = chainedRender;

export default render;
