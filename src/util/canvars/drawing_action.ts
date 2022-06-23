import {
  ElementsPosition,
  ElementsList,
  ElementsInfo,
  ElementsPencilPosition,
} from '../../type/canvasDefine';
import { positionWithinElement } from './math';

function pointerPosition(x1: number, y1: number) {
  const changeX = x1 - 8;
  const changeY = y1 - 30;
  return { changeX, changeY };
}

function createElement({ id, type, position, points, text }: ElementsInfo) {
  switch (type) {
    case 'line':
    case 'rect': {
      const [{ x1, y1, x2, y2 }] = points as ElementsPosition[];
      return { id, type, position, text, points: [{ x1, y1, x2, y2 }] };
    }
    case 'pencil': {
      const [{ x1, y1 }] = points as ElementsPencilPosition[];

      return {
        id,
        type,
        position,
        text,
        points: [{ x1, y1 }],
      };
    }
    case 'text': {
      const [{ x1, y1 }] = points as ElementsPencilPosition[];
      return { id, type, position, text: '', points: [{ x1, y1 }] };
    }

    default:
      throw new Error(`Type not found ${type}`);
  }
}

function canversTarget(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return function (elementInfo: ElementsInfo) {
    switch (elementInfo.type) {
      case 'line':
        return createLine(ctx, elementInfo.points as ElementsPosition[]);
      case 'rect':
        return createRect(ctx, elementInfo.points as ElementsPosition[]);
      case 'pencil':
        return createBurush(ctx, elementInfo.points);
      case 'text':
        return createText(ctx, elementInfo.points, elementInfo.text as string);
      default:
        throw new Error(`Type not found ${elementInfo.type}`);
    }
  };
}
// 라인 그리기 기능
function createLine(ctx: CanvasRenderingContext2D, points: ElementsPosition[]) {
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
function createRect(ctx: CanvasRenderingContext2D, points: ElementsPosition[]) {
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
function createBurush(
  ctx: CanvasRenderingContext2D,
  points: ElementsPencilPosition[]
) {
  for (let i = 0; i < points.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(points[i].x1, points[i].y1);
    ctx.lineTo(points[i + 1].x1, points[i + 1].y1);
    ctx.stroke();
  }

  return;
}

//텍스트  생성
function createText(
  ctx: CanvasRenderingContext2D,
  points: ElementsPencilPosition[],
  text: string
) {
  for (const property of points) {
    const { x1, y1 } = property;
    ctx.beginPath();
    ctx.font = '48px serif';
    ctx.fillText(text, x1, y1);
    return;
  }
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
  points: ElementsPosition[]
) {
  const index = points.length - 1;
  const { x1, y1, x2, y2 } = points[index];
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
