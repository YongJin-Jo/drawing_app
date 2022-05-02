import './render';

function line(startX: number, startY: number, endX: number, endY: number): any {
  return { type: 'path', ops: _l(startX, startY, endX, endY) };
}

function rectangle(
  startX: number,
  startY: number,
  width: number,
  height: number
) {
  return { type: 'path', ops: _r(startX, startY, width, height) };
}

function _l(startX: number, startY: number, endX: number, endY: number) {
  const ops = [];
  ops.push({ op: 'moveTo', data: [startX, startY] });
  ops.push({ op: 'lineTo', data: [endX, endY] });
  return ops;
}

function _r(startX: number, startY: number, width: number, height: number) {
  const points = [
    [startX, startY],
    [startX + width, startY],
    [startX + width, startY + height],
    [startX, startY + height],
  ];
  const ops = [];
  for (let i = 0; i < points.length - 1; i++) {
    ops.push(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
  }
  return ops;
}
export { line, rectangle };
