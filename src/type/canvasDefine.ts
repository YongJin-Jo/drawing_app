export interface ElementsInfo {
  id: string;
  type: Tool;
  position: string | null;
  points: ElementsPosition[] | ElementsPencilPosition[];
}

export type ElementsPosition = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};
export type ElementsPencilPosition = {
  x1: number;
  y1: number;
};
export type ElementsList = ElementsInfo[];

export interface SelectPosition extends ElementsInfo {
  offsetX: number | number[];
  offsetY: number | number[];
}

export type Tool = 'selection' | 'line' | 'rect' | 'pencil';
export type Action = 'none' | 'drawing' | 'moving' | 'resize';

export type setState = (
  state: ElementsList | ((prevState: ElementsList) => ElementsList),
  overwirte?: boolean
) => void;
export type Void = () => void;
