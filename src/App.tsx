import React, { useLayoutEffect, useState } from 'react';

interface PositionTarget {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const createElement = (
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  ctx: CanvasRenderingContext2D
) => {
  ctx?.beginPath();
  ctx?.moveTo(startX, startY);
  ctx?.lineTo(endX, endY);
  ctx?.stroke();
  return { endX, endY };
};

function App() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [element, setElement] = useState<PositionTarget[]>([]);
  const [drawing, setDrawing] = useState(false);
  useLayoutEffect(() => {
    const canvas = document.getElementById('Canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    setCtx(ctx);
  });

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    console.log(event.clientX, event.clientY);

    const mousePositon: PositionTarget = {
      startX: event.clientX,
      startY: event.clientY,
      endX: event.clientX,
      endY: event.clientY,
    };
    setElement(prev => {
      return [...prev, mousePositon];
    });
    setDrawing(true);
  };
  const handleMouseOut = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    setDrawing(false);
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    event.preventDefault();
    const index = element.length - 1;
    const { startX, startY } = element[index];
    const updateElements = createElement(
      startX,
      startY,
      event.clientX,
      event.clientY,
      ctx as CanvasRenderingContext2D
    );

    setElement(prev => {
      const array = [...prev];
      const index = array.length - 1;
      array[index].startX = updateElements.endX;
      array[index].startY = updateElements.endY;
      return [...array];
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
