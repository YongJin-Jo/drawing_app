import './render';

function line(startX: number, startY: number, endX: number, endY: number): any {
  return { type: 'path', ops: dubleline(startX, startY, endX, endY) };
}

function dubleline(startX: number, startY: number, endX: number, endY: number) {
  const o1 = _l(startX, startY, endX, endY, true, true);
  return o1;
}

function _l(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  move: boolean,
  overlay: boolean
) {
  const ops = [];
  if (move) {
    if (overlay) {
      ops.push({
        op: 'move',
        data: [x1, y1],
      });
    } else {
      ops.push({
        op: 'move',
        data: [x1, y1],
      });
    }
  }

  if (overlay) {
    ops.push({
      op: 'bcurveTo',
      data: [x1, y1, x1 + 2 * (x2 - x1), y1 + 2 * (y2 - y1), x2, y2],
    });
  } else {
    ops.push({
      op: 'bcurveTo',
      data: [
        x1 + (x2 - x1),
        y1 + (y2 - y1),
        x1 + 2 * (x2 - x1),
        y1 + 2 * (y2 - y1),
        x2,
        y2,
      ],
    });
  }
  return ops;
}
export { line };
