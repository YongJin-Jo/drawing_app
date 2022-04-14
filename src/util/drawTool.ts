import { PositionTarget } from '../type/Canvas';

function drawTool(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return function (
    toolType: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    let roughElement;
    if (toolType === 'Brush') {
      roughElement = brushTool(ctx, startX, startY, endX, endY);
    } else if (toolType === 'Line') {
      roughElement = lineTool(ctx, startX, startY, endX, endY);
    } else if (toolType === 'Rect') {
      roughElement = rectTool(ctx, startX, startY, endX, endY);
    }
    return { ...roughElement, toolType } as PositionTarget;
  };
}

// 브러쉬
function brushTool(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  return { startX: endX, startY: endY, endX, endY };
}

// 직석
export { drawTool };
function lineTool(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  return { startX, startY, endX, endY };
}

//사각형
function rectTool(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  ctx.beginPath();
  ctx.strokeRect(startX, startY, endX - startX, endY - startY);
  ctx.stroke();
  return { startX, startY, endX, endY };
}
