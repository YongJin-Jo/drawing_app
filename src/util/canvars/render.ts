import './render';

function line(startX: number, startY: number, endX: number, endY: number): any {
  return { type: 'path', ops: dubleline(startX, startY, endX, endY) };
}

function dubleline(startX: number, startY: number, endX: number, endY: number) {
  const o1 = _l(startX, startY);
  const o2 = _l(endX, endY);
  return [o1, o2];
}

function _l(x: number, y: number) {
  return { op: 'move', data: [x, y] };
}
export { line };
