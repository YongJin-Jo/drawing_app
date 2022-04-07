import React, { useLayoutEffect, useState } from 'react';

type ElementsDefain = { clientX: number; clientY: number }[];

function App() {
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [elements, setElements] = useState<ElementsDefain>([]);
  const [drawing, setDrawing] = useState(false);
  useLayoutEffect(() => {
    const canvas = document.getElementById('Canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setCtx(ctx);

    ctx?.strokeRect(0, 0, 10, 1);
  });

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const { clientX, clientY } = event;
    //const elemnts = { clientX, clientY };
    ctx?.beginPath();
    ctx?.moveTo(clientX, clientY);
    ctx?.stroke();

    //setElements(prevState => [...prevState, elemnts]);
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const { clientX, clientY } = event;
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;

    ctx?.lineTo(clientX, clientY);
    ctx?.stroke();
    setDrawing(false);
  };

  return (
    <canvas
      id="Canvas"
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDoun}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    ></canvas>
  );
}

export default App;
