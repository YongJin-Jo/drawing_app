import { Generator } from './canvars/generator';

const gen = new Generator();

function createElement(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  toolType: string
) {
  let data;
  switch (toolType) {
    case 'Line':
      data = gen.line(startX, startY, endX, endY);
      break;
    case 'Rect':
      data = gen.rectangle(startX, startY, endY, endY);
      break;
  }
  return { startX, startY, endX, endY, data };
}

export { createElement };
