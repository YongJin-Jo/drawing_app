import {
  ElementPoint,
  ElementsDefain,
  ElementsPosition,
} from '../../type/canvasDefine';
import { positionWithinElement } from './math';

function pointerPosition(x1: number, y1: number) {
  const changeX = x1 - 8;
  const changeY = y1 - 30;
  return { changeX, changeY };
}

function createElement({
  id,
  type,
  position,
  points: [{ x1, y1, x2, y2 }],
}: ElementsPosition) {
  switch (type) {
    case 'line':
    case 'rect':
      return { id, type, position, points: [{ x1, y1, x2, y2 }] };
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
  return function (elementInfo: ElementsPosition) {
    switch (elementInfo.type) {
      case 'line':
        return createLine(ctx, elementInfo.points);
      case 'rect':
        return createRect(ctx, elementInfo.points);
      case 'pencil':
        return createBurush(ctx, elementInfo.points);
      default:
        throw new Error(`Type not found ${elementInfo.type}`);
    }
  };
}
// 라인 그리기 기능
function createLine(ctx: CanvasRenderingContext2D, points: ElementPoint) {
  for (const property of points) {
    const { x1, y1, x2, y2 } = property;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

//사각형 그리기 기능
function createRect(ctx: CanvasRenderingContext2D, points: ElementPoint) {
  for (const property of points) {
    const { x1, y1, x2, y2 } = property;
    const w = x2 - x1;
    const h = y2 - y1;
    ctx.save();
    ctx.beginPath();
    ctx.strokeRect(x1, y1, w, h);
  }
}

// 브러쉬
function createBurush(ctx: CanvasRenderingContext2D, points: ElementPoint) {
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
