import { Drawable } from '../../type/Canvas';

export class DrawingTool {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }
  draw(drawable: Drawable) {
    const sets = drawable ? drawable.sets : [];

    const ctx = this.ctx;
    for (const drawable of sets) {
      switch (drawable.type) {
        case 'path':
          this.drawToContext(ctx, drawable);
          break;
        case 'fillPath':
          ctx.save();
          ctx.restore();
          break;
        case 'fillSketch':
          ctx.save();
          ctx.restore();
          break;
      }
    }
  }

  drawToContext(ctx: CanvasRenderingContext2D, drawable: any) {
    //console.log(drawable);

    ctx.beginPath();
    for (const item of drawable.ops) {
      const data = item.data;

      switch (item.op) {
        case 'moveTo':
          ctx.moveTo(data[0], data[1]);
          break;
        case 'bcurveTo':
          ctx.bezierCurveTo(
            data[0],
            data[1],
            data[2],
            data[3],
            data[4],
            data[5]
          );
          break;
        case 'lineTo':
          ctx.lineTo(data[0], data[1]);
          break;
      }
    }

    ctx.stroke();
  }
}
