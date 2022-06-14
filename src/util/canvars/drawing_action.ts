import { ElementsDefain, ElementsPosition } from '../../type/canvasDefine';
import { positionWithinElement } from './math';

function pointerPosition(x1: number, y1: number) {
  const changeX = x1 - 8;
  const changeY = y1 - 30;
  return { changeX, changeY };
}

function createElement({
  id,
  x1,
  y1,
  x2,
  y2,
  type,
  position,
}: ElementsPosition) {
  switch (type) {
    case 'line':
    case 'rect':
      return { id, x1, y1, x2, y2, type, position };
    case 'pencil':
      return {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        position,
        points: [{ x1, y1, x2, y2 }],
      };
    default:
      throw new Error(`Type not found ${type}`);
  }
}

function canversTarget(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return function (data: ElementsPosition) {
    switch (data.type) {
      case 'line':
        return createLine(ctx, data);
      case 'rect':
        return createRect(ctx, data);
      case 'pencil':
        return createBurush(ctx, data.points as ElementPoint);
      default:
        throw new Error(`Type not found ${data.type}`);
    }
  };
}

// 라인 그리기 기능
function createLine(ctx: CanvasRenderingContext2D, data: ElementsPosition) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(data.x1, data.y1);
  ctx.lineTo(data.x2, data.y2);
  ctx.stroke();
}

//사각형 그리기 기능
function createRect(ctx: CanvasRenderingContext2D, data: ElementsPosition) {
  const w = data.x2 - data.x1;
  const h = data.y2 - data.y1;
  ctx.save();
  ctx.beginPath();
  ctx.strokeRect(data.x1, data.y1, w, h);
  return;
}

// 브러쉬
type ElementPoint = Pick<ElementsPosition, 'points'>;
function createBurush(ctx: CanvasRenderingContext2D, data: ElementPoint) {
  return;
}

// 좌표 수정
function getElementAtPosition(x: number, y: number, elements: ElementsDefain) {
  const findElements = elements
    .map(element => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find(element => element.position !== null) as ElementsPosition;

  return findElements;
}

export {
  pointerPosition,
  createElement,
  createLine,
  createRect,
  canversTarget,
  getElementAtPosition,
};
