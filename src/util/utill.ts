import { Generator } from './canvars/generator';

const gen = new Generator();

function createElement(
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  const data = gen.line(startX, startY, endX, endY);
  return { startX, startY, endX, endY, data };
}

export { createElement };
