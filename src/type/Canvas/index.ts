export interface PositionTarget {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  toolType?: string;
  data?: Drawable;
}

//drawingTool
export interface Drawable {
  shape: string;
  sets: OpSet[];
}

//generator

//render
export interface OpSet {
  type: string;
  ops: { op: string; data: number[] }[];
}
