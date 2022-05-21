import { ElementsDefain, ElementsPosition } from '../../type/canvasDefine';
import { isWithinElement } from './math';

function pointerPosition(x1: number, y1: number) {
  const changeX = x1 - 8;
  const changeY = y1 - 30;
  return { changeX, changeY };
}

function createElement({ id, x1, y1, x2, y2, type }: ElementsPosition) {
  return { id, x1, y1, x2, y2, type };
}

function canversTarget(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return function (data: ElementsPosition) {
    switch (data.type) {
      case 'line':
        createLine(ctx, data);
        break;
      case 'rect':
        createRect(ctx, data);
        break;
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
function createBurush(ctx: CanvasRenderingContext2D, data: ElementsPosition) {
  return;
}

// 좌표 수정
function getElementAtPosition(x: number, y: number, elements: ElementsDefain) {
  return elements.find(element => isWithinElement(x, y, element));
}

export {
  pointerPosition,
  createElement,
  createLine,
  createRect,
  canversTarget,
  getElementAtPosition,
};
