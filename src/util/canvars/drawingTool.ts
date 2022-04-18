import { Drawable } from 'roughjs/bin/core';

export class DrawingTool {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }
  draw(drawable: Drawable) {
    const sets = drawable.sets || [];
    const ctx = this.ctx;
    for (const drawable of sets) {
      switch (drawable.type) {
        case 'path':
          ctx.save();
          this.drawToContext(ctx, drawable);
          ctx.restore();
          break;
        case 'filePath':
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
    ctx.beginPath();
    for (const item of drawable.ops) {
      const data = item.data;
      switch (item.op) {
        case 'moveTo':
          ctx.moveTo(data[0], data[1]);
          break;
        case 'LineTo':
          ctx.lineTo(data[0], data[1]);
          break;
      }
    }
  }
}
