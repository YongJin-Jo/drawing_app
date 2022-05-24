import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Action,
  ElementsDefain,
  ElementsPosition,
  Tool,
} from './type/canvasDefine';
import {
  canversTarget,
  createElement,
  getElementAtPosition,
  pointerPosition,
} from './util/canvars/drawing_action';

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

  const updateElement = ({ id, x1, y1, x2, y2, type }: ElementsPosition) => {
    const updatedEleElement = createElement({ id, x1, y1, x2, y2, type });

    const elementsCopy = [...elements];
    const findindex = elementsCopy.findIndex(item => item.id === id);

    elementsCopy[findindex] = updatedEleElement;

    setElements(elementsCopy);
  };

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    const { changeX, changeY } = pointerPosition(clientX, clientY);

    if (tooltype === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        const offsetX = changeX - element.x1;
        const offsetY = changeY - element.y1;

        setSelectedElement({ ...element, offsetX, offsetY });
        setAction('moving');
      }
    } else {
      setAction('drawing');
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
    if (tooltype === 'selection') {
      event.currentTarget.style.cursor = getElementAtPosition(
        changeX,
        changeY,
        elements
      )
        ? 'move'
        : 'default';
    }

    if (action === 'drawing') {
      event.currentTarget.style.cursor = 'crosshair';
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
      updateElement(createPosition);
    } else if (action === 'moving') {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY } =
        selectedElement as ElementsPosition;
      const w = x2 - x1;
      const h = y2 - y1;
      const newX1 = changeX - (offsetX as number);
      const newY1 = changeY - (offsetY as number);

      updateElement({
        id,
        x1: newX1,
        y1: newY1,
        x2: newX1 + w,
        y2: newY1 + h,
        type,
      });
    }
  };
  const handleMouseUp = () => {
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
