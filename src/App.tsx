import React, { useLayoutEffect, useState } from 'react';
import { PositionTarget } from './type/Canvas';
import { drawTool } from './util/drawTool';

function App() {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [toolType, setToolType] = useState<string>('none');
  const [element, setElement] = useState<PositionTarget[]>([]);
  const [drawing, setDrawing] = useState(false);
  useLayoutEffect(() => {
    const canvas = document.getElementById('Canvas') as HTMLCanvasElement;
    const tool = drawTool(canvas as HTMLCanvasElement);
    setCanvas(canvas);
  }, [element]);

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();

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
    const tool = drawTool(canvas as HTMLCanvasElement);

    const updateElements = tool(
      toolType,
      startX,
      startY,
      event.clientX,
      event.clientY
    );

    setElement(prev => {
      const array = [...prev];
      const index = array.length - 1;
      array[index] = updateElements;
      return [...array];
    });
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    setDrawing(false);
  };

  return (
    <>
      <div>
        <input
          type="checkbox"
          value={'Brush'}
          onChange={() => {
            setToolType('Brush');
          }}
        />
        <label>Brush</label>
        <input
          type="checkbox"
          value={'Line'}
          onChange={() => {
            setToolType('Line');
          }}
        />
        <label>Line</label>
        <input
          type="checkbox"
          value={'Rect'}
          onChange={() => {
            setToolType('Rect');
          }}
        />
        <label>Rect</label>
      </div>
      <canvas
        id="Canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDoun}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseOut}
        onMouseUp={handleMouseUp}
      ></canvas>
    </>
  );
}

export default App;
