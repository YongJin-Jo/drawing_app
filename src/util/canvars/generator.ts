import { OpSet } from '../../type/Canvas';
import { line, rectangle } from './render';

export class Generator {
  _d(shape: string, sets: OpSet[]) {
    return { shape, sets: sets || [] };
  }

  line(startX: number, startY: number, endX: number, endY: number) {
    return this._d('line', [line(startX, startY, endX, endY)]);
  }

  rectangle(startX: number, startY: number, width: number, height: number) {
    return this._d('rect', [rectangle(startX, startY, width, height)]);
  }
}
