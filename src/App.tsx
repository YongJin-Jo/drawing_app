import React, { useLayoutEffect, useRef, useState } from 'react';

interface ElementsPosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: string;
}
type ElementsDefain = ElementsPosition[];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [tooltype, setTooltype] = useState<string>('');
  const [elements, setElements] = useState<ElementsDefain>([]);
  const [drawing, setDrawing] = useState(false);
  useLayoutEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    const core = canversTarget(canvas);
    setCtx(ctx);
    elements.forEach(data => core(data));
  }, [elements]);

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const { clientX, clientY } = event;
    const { changeX, changeY } = pointerPosition(clientX, clientY);
    const updateElement = {
      x1: changeX,
      y1: changeY,
      x2: changeX,
      y2: changeY,
      type: tooltype,
    };

    setElements(prevState => [...prevState, updateElement]);
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const len = elements.length - 1;
    const { x1, y1 } = elements[len];
    const { clientX, clientY } = event;
    const { changeX, changeY } = pointerPosition(clientX, clientY);

    const updateElement = {
      x1,
      y1,
      x2: changeX,
      y2: changeY,
      type: tooltype,
    };

    setElements(prevState => {
      const state = prevState;
      state[state.length - 1] = updateElement;
      return [...state];
    });
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(false);
  };

  return (
    <>
      <input
        type="checkbox"
        onClick={() => {
          setTooltype('line');
        }}
      />
      <label htmlFor="Line">Line</label>
      <input
        type="checkbox"
        onClick={() => {
          setTooltype('rect');
        }}
      />
      <label htmlFor="Line">Rect</label>
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

function createLine(ctx: CanvasRenderingContext2D, data: ElementsPosition) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(data.x1, data.y1);
  ctx.lineTo(data.x2, data.y2);
  ctx.stroke();
}

function createRect(ctx: CanvasRenderingContext2D, data: ElementsPosition) {
  const w = data.x2 - data.x1;
  const h = data.y2 - data.y1;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(data.x1, data.y1);
  ctx.strokeRect(data.x1, data.y1, w, h);
  return;
}

function createBurush(ctx: CanvasRenderingContext2D, data: ElementsPosition) {
  return;
}

function pointerPosition(x1: number, y1: number) {
  const changeX = x1 - 8;
  const changeY = y1 - 30;

  return { changeX, changeY };
}

export default App;
