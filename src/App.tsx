import React, { useLayoutEffect, useRef, useState } from 'react';

interface ElementsPosition {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: string;
}
type ElementsDefain = ElementsPosition[];
type Tool = 'selection' | 'line' | 'rect';
type Action = 'none' | 'drawing' | 'moving';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [tooltype, setTooltype] = useState<Tool>('line');
  const [elements, setElements] = useState<ElementsDefain>([]);
  const [selectedElement, setSelectedElement] =
    useState<ElementsPosition | null>(null);
  const [action, setAction] = useState<Action>('none');

  useLayoutEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    const core = canversTarget(canvas);
    setCtx(ctx);
    elements.forEach(data => core(data));
  }, [elements]);

  const updateEleElement = ({ id, x1, y1, x2, y2, type }: ElementsPosition) => {
    const updatedEleElement = createElement({ id, x1, y1, x2, y2, type });
    const elementsCopy = [...elements];
    const findindex = elementsCopy.findIndex(item => item.id === id);
    elements[findindex] = updatedEleElement;
    setElements(elementsCopy);
  };

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    if (tooltype === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        setSelectedElement(element);
        setAction('moving');
      }
    } else {
      setAction('drawing');
      const { changeX, changeY } = pointerPosition(clientX, clientY);
      const createPosition = {
        id: Date.now().toString(),
        x1: changeX,
        y1: changeY,
        x2: changeX,
        y2: changeY,
        type: tooltype,
      };

      const updateElement = createElement(createPosition);

      setElements(prevState => [...prevState, updateElement]);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    const { changeX, changeY } = pointerPosition(clientX, clientY);
    if (action === 'drawing') {
      const len = elements.length - 1;
      const { id, x1, y1 } = elements[len];
      const createPosition = {
        id,
        x1,
        y1,
        x2: changeX,
        y2: changeY,
        type: tooltype,
      };

      updateEleElement(createPosition);
    } else if (action === 'moving') {
      const { id, x1, x2, y1, y2, type } = selectedElement as ElementsPosition;
      const w = x2 - x1;
      const h = y2 - y1;
      updateEleElement({
        id,
        x1: changeX,
        y1: changeY,
        x2: changeX + w,
        y2: changeY + h,
        type,
      });
    }
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setAction('none');
    setSelectedElement(null);
  };

  return (
    <>
      <div>
        <input
          type="radio"
          checked={tooltype === 'selection'}
          onChange={() => {
            setTooltype('selection');
          }}
        />
        <label htmlFor="Selection">Selection</label>
        <input
          type="radio"
          checked={tooltype === 'line'}
          onChange={() => {
            setTooltype('line');
          }}
        />
        <label htmlFor="Line">Line</label>
        <input
          type="radio"
          checked={tooltype === 'rect'}
          onChange={() => {
            setTooltype('rect');
          }}
        />
        <label htmlFor="rect">Rect</label>
      </div>

      <canvas
        ref={canvasRef}
        id="Canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDoun}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </>
  );
}

export default App;

function createElement({ id, x1, y1, x2, y2, type }: ElementsPosition) {
  return { id, x1, y1, x2, y2, type };
}

function canversTarget(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  return function (data: ElementsPosition) {
    switch (data.type) {
      case 'line':
        createLine(ctx, data);
        break;
      case 'rect':
        createRect(ctx, data);
        break;
    }
  };
}

// 라인 그리기 기능
function createLine(ctx: CanvasRenderingContext2D, data: ElementsPosition) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(data.x1, data.y1);
  ctx.lineTo(data.x2, data.y2);
  ctx.stroke();
}

//사각형 그리기 기능
function createRect(ctx: CanvasRenderingContext2D, data: ElementsPosition) {
  const w = data.x2 - data.x1;
  const h = data.y2 - data.y1;
  ctx.save();
  ctx.beginPath();
  ctx.strokeRect(data.x1, data.y1, w, h);
  return;
}
// 브러쉬
function createBurush(ctx: CanvasRenderingContext2D, data: ElementsPosition) {
  return;
}

function pointerPosition(x1: number, y1: number) {
  const changeX = x1 - 8;
  const changeY = y1 - 30;

  return { changeX, changeY };
}

// 좌표 수정
function getElementAtPosition(x: number, y: number, elements: ElementsDefain) {
  return elements.find(element => isWithinElement(x, y, element));
}

function isWithinElement(
  x: number,
  y: number,
  element: ElementsPosition
): unknown {
  const { type, x1, x2, y1, y2 } = element;

  if (type === 'rect') {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  } else {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < 1;
  }
}
function distance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}
