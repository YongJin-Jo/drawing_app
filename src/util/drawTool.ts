function drawTool(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return function (
    toolType: string,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    if (toolType === 'Brush') {
      brushTool(ctx, startX, startY, endX, endY);
    } else if (toolType === 'Line') {
      lineTool(ctx, startX, startY, endX, endY);
    } else if (toolType === 'Rect') {
      rectTool(ctx, startX, startY, endX, endY);
    }
    return { endX, endY };
  };
}

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
}

export { drawTool };
function lineTool(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  throw new Error('Function not implemented.');
}

function rectTool(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number
) {
  throw new Error('Function not implemented.');
}
