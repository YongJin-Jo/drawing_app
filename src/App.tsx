import React, { useLayoutEffect, useState } from 'react';

type ElementsDefain = { clientX: number; clientY: number }[];

function App() {
  const [centext, setContext] = useState<CanvasRenderingContext2D | null>();
  const [elements, setElements] = useState<ElementsDefain>([]);
  const [drawing, setDrawing] = useState(false);
  useLayoutEffect(() => {
    const canvas = document.getElementById('Canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    setContext(ctx);

    ctx?.strokeRect(0, 0, 10, 1);
  });

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const { clientX, clientY } = event;
    const elemnts = { clientX, clientY };
    centext?.strokeRect(clientX, clientY, 1, 1);
    setElements(prevState => [...prevState, elemnts]);
  };
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const { clientX, clientY } = event;
    centext?.strokeRect(clientX, clientY, 1, 1);
    console.log(clientX, clientY);
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
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
