import React, { useLayoutEffect, useRef, useState } from 'react';
import { Drawable, PositionTarget } from './type/Canvas';
import Core from './util/canvars/canvas';
import { createElement } from './util/utill';
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [toolType, setToolType] = useState<string>('none');
  const [element, setElement] = useState<PositionTarget[]>([]);
  const [drawing, setDrawing] = useState(false);
  useLayoutEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const core = Core.drawingTool(canvas);
    element.forEach(item => core.draw(item?.data as Drawable));
  }, [element]);

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();

    const mousePositon: PositionTarget = {
      startX: event.clientX,
      startY: event.clientY,
      endX: event.clientX,
      endY: event.clientY,
    };
    console.log('click', mousePositon);

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
    const len = element.length - 1;
    const { startX, startY } = element[len];
    const { clientX, clientY } = event;

    const updateElement = createElement(
      startX,
      startY,
      clientX,
      clientY,
      toolType
    );

    setElement(prev => {
      const array = [...prev];
      const index = array.length - 1;
      array[index] = updateElement;
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
          type="radio"
          value={'Line'}
          onChange={() => {
            setToolType('Line');
          }}
        />
        <label>Line</label>
        <input
          type="radio"
          value={'Rect'}
          onChange={() => {
            setToolType('Rect');
          }}
        />
        <label>Rect</label>
      </div>
      <canvas
        ref={canvasRef}
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
