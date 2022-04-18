import { line } from './render';
interface SetsDefind {
  type: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
export class Generator {
  _d(shape: string, sets: SetsDefind[]) {
    return { shape, sets: sets || [] };
  }

  line(startX: number, startY: number, endX: number, endY: number) {
    return this._d('line', [line(startX, startY, endX, endY)]);
  }
}
