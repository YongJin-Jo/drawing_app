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
  console.log(startX, startY, width, height);

  return { type: 'path', ops: _r(startX, startY, width, height) };
}

function _l(startX: number, startY: number, endX: number, endY: number) {
  const ops = [];
  ops.push({ op: 'moveTo', data: [startX, startY] });
  ops.push({ op: 'lineTo', data: [endX, endY] });
  return ops;
}

function _r(startX: number, startY: number, width: number, height: number) {
  const points = [startX, startY, width - startX, height - startY];
  const ops = [{ op: 'strokeRect', data: [...points] }];

  return ops;
}
export { line, rectangle };
