import React, { useLayoutEffect, useState } from 'react';

interface PointTarget {
  pointX: number;
  pointY: number;
}

function App() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  //const [canvasOffset, setCanvasOffset] = useState<CanvasOffset | null>(null);
  //const [elements, setElements] = useState<ElementsDefain>([]);
  const [drawing, setDrawing] = useState(false);
  const [startTarget, setStartTarget] = useState<PointTarget | null>(null);
  //const [moveTarget, setMoveTarget] = useState<PointTarget | null>(null);
  useLayoutEffect(() => {
    const canvas = document.getElementById('Canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    setCtx(ctx);
  });

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    console.log(event.clientX, event.clientY);

    setStartTarget({
      pointX: event.clientX,
      pointY: event.clientY,
    });

    setDrawing(true);
    console.log(startTarget);
  };
  const handleMouseOut = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    setDrawing(false);
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    event.preventDefault();

    ctx?.beginPath();
    ctx?.moveTo(startTarget?.pointX as number, startTarget?.pointY as number);
    ctx?.lineTo(event.clientX, event.clientY);
    ctx?.stroke();
    setStartTarget({
      pointX: event.clientX,
      pointY: event.clientY,
    });
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setDrawing(false);
  };

  return (
    <canvas
      id="Canvas"
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDoun}
      onMouseMove={handleMouseMove}
      onMouseOut={handleMouseOut}
      onMouseUp={handleMouseUp}
    ></canvas>
  );
}

export default App;
