import { OpSet } from '../../type/Canvas';
import { line } from './render';

export class Generator {
  _d(shape: string, sets: OpSet[]) {
    return { shape, sets: sets || [] };
  }

  line(startX: number, startY: number, endX: number, endY: number) {
    return this._d('line', [line(startX, startY, endX, endY)]);
  }
}
