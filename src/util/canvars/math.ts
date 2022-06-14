import { ElementsPosition } from '../../type/canvasDefine';

export { positionWithinElement, adjustElementCoordinates };

function positionWithinElement(
  x: number,
  y: number,
  element: ElementsPosition
): unknown {
  const { type, points } = element;
  const index = points.length - 1;
  const { x1, y1, x2, y2 } = points[index];
  if (type === 'rect') {
    const topLeft = nearPoint(x, y, x1, y1, 'tl');
    const topRight = nearPoint(x, y, x2, y1, 'tr');
    const bottomLeft = nearPoint(x, y, x1, y2, 'bl');
    const bottomRight = nearPoint(x, y, x2, y2, 'br');
    const inside = x > x1 && x < x2 && y > y1 && y < y2 ? 'inside' : null;

    return topLeft || topRight || bottomLeft || bottomRight || inside;
  } else {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    const start = nearPoint(x, y, x1, y1, 'start');
    const end = nearPoint(x, y, x2, y2, 'end');
    const inside = Math.abs(offset) < 1 ? 'inside' : null;

    return inside || start || end;
  }
}

function adjustElementCoordinates(element: ElementsPosition) {
  const { type, points } = element;
  const index = points.length - 1;
  const { x1, y1, x2, y2 } = points[index];

  if (type === 'rect') {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1, y1, x2, y2 };
    }
  }
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function nearPoint(x: number, y: number, x1: number, y1: number, name: string) {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
}
