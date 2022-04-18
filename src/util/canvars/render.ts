import './render';

function line(startX: number, startY: number, endX: number, endY: number): any {
  return { type: 'path', ops: { startX, startY, endX, endY } };
}

export { line };
