import {
  ElementsPosition,
  ElementsList,
  ElementsInfo,
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
}: ElementsInfo) {
  switch (type) {
    case 'line':
    case 'rect':
      return { id, type, position, points: [{ x1, y1, x2, y2 }] };
    case 'pencil':
      return {
        id,
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
  return function (elementInfo: ElementsInfo) {
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
function createLine(ctx: CanvasRenderingContext2D, points: ElementsPosition) {
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
function createRect(ctx: CanvasRenderingContext2D, points: ElementsPosition) {
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
function createBurush(ctx: CanvasRenderingContext2D, points: ElementsPosition) {
  for (const property of points) {
    const { x1, y1, x2, y2 } = property;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  return;
}

// 좌표 수정
function getElementAtPosition(x: number, y: number, elements: ElementsList) {
  const findElements = elements
    .map(element => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find(element => element.position !== null) as ElementsInfo;

  return findElements;
}

// 사이즈 재조정
function resizingCoordinates(
  changeX: number,
  changeY: number,
  position: string,
  coordinates: {
    points: { x1: number; y1: number; x2: number; y2: number }[];
  }
) {
  const index = coordinates.points.length - 1;
  const { x1, y1, x2, y2 } = coordinates.points[index];
  switch (position) {
    case 'tl':
    case 'start':
      return { x1: changeX, y1: changeY, x2, y2 };
    case 'bl':
      return { x1: changeX, y1, x2, y2: changeY };
    case 'br':
    case 'end':
      return { x1, y1, x2: changeX, y2: changeY };
    default:
      return { x1, y1: changeY, x2: changeX, y2 };
  }
}

export {
  pointerPosition,
  createElement,
  createLine,
  createRect,
  canversTarget,
  getElementAtPosition,
  resizingCoordinates,
};
