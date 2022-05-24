export interface ElementsPosition {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: string;
  offsetX?: number;
  offsetY?: number;
}
export type ElementsDefain = ElementsPosition[];
export type Tool = 'selection' | 'line' | 'rect';
export type Action = 'none' | 'drawing' | 'moving';
