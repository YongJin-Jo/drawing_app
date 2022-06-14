export interface ElementsPosition {
  id: string;
  type: Tool;
  position: string | null;
  points: ElementPoint;
}

export type ElementPoint = { x1: number; y1: number; x2: number; y2: number }[];

export interface SelectPosition extends ElementsPosition {
  offsetX: number;
  offsetY: number;
}

export type ElementsDefain = ElementsPosition[];
export type Tool = 'selection' | 'line' | 'rect' | 'pencil';
export type Action = 'none' | 'drawing' | 'moving' | 'resize';
export type setState = (
  state: ElementsDefain | ((prevState: ElementsDefain) => ElementsDefain),
  overwirte?: boolean
) => void;
export type Void = () => void;
