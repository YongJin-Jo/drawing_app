import { DrawingTool } from './drawingTool';
import { Generator } from './generator';

export default {
  drawingTool(canvas: HTMLCanvasElement) {
    return new DrawingTool(canvas);
  },
  generator() {
    return new Generator();
  },
};
