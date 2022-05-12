import React, { useLayoutEffect, useRef, useState } from 'react';

interface ElementsPosition {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}
type ElementsDefain = ElementsPosition[];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [elements, setElements] = useState<ElementsDefain>([]);
  const [drawing, setDrawing] = useState(false);
  useLayoutEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setCtx(ctx);
    elements.forEach(data => createLine(canvas, data));
  }, [elements]);

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const { clientX, clientY } = event;
    const updateElement = {
      x1: clientX,
      y1: clientY,
      x2: clientX,
      y2: clientY,
    };

    setElements(prevState => [...prevState, updateElement]);
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;

    const len = elements.length - 1;
    const { x1, y1 } = elements[len];
    const { clientX, clientY } = event;
    const updateElement = {
      x1,
      y1,
      x2: clientX,
      y2: clientY,
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
    <canvas
      ref={canvasRef}
      id="Canvas"
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDoun}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    ></canvas>
  );
}

function createLine(canvas: HTMLCanvasElement, data: ElementsPosition) {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(data.x1, data.y1);
  ctx.lineTo(data.x2, data.y2);
}

export default App;
