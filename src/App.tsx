<<<<<<< HEAD
import React, {
  KeyboardEvent,
  KeyboardEventHandler,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useHistory } from './hooks/hook';
import {
  Action,
  ElementsDefain,
  ElementsPosition,
  SelectPosition,
  Tool,
  setState,
} from './type/canvasDefine';
import { cursorForPosition } from './util/canvars/cursorStyle';
import {
  canversTarget,
  createElement,
  getElementAtPosition,
  pointerPosition,
} from './util/canvars/drawing_action';
import { adjustElementCoordinates } from './util/canvars/math';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltype, setTooltype] = useState<Tool>('line');
  //const [elements, setElements] = useState<ElementsDefain>([]);
  const [selectedElement, setSelectedElement] = useState<SelectPosition | null>(
    null
  );
  const [elements, setElements, undo, redo] = useHistory([]);
  const [action, setAction] = useState<Action>('none');

  useLayoutEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    const core = canversTarget(canvas);
    elements.forEach(data => core(data));
  }, [elements]);
  useLayoutEffect(() => {
    const undoRedoFunction = (event: any) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    document.addEventListener('keydown', undoRedoFunction);

    return () => {
      document.removeEventListener('keydown', undoRedoFunction);
    };
  }, [undo, redo]);
  const updateElement = ({
    id,
    x1,
    y1,
    x2,
    y2,
    type,
    position,
  }: ElementsPosition) => {
    const updatedEleElement = createElement({
      id,
      x1,
      y1,
      x2,
      y2,
      type,
      position,
    });
    const adjustElement = adjustElementCoordinates(updatedEleElement);
    const elementsCopy = [...elements];
    const findindex = elementsCopy.findIndex(item => item.id === id);

    elementsCopy[findindex] = {
      id,
      type,
      x1: adjustElement.x1,
      y1: adjustElement.y1,
      x2: adjustElement.x2,
      y2: adjustElement.y2,
      position: null,
    };

    setElements(elementsCopy, true);
  };

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    const { changeX, changeY } = pointerPosition(clientX, clientY);

    if (tooltype === 'selection') {
      const element = getElementAtPosition(changeX, changeY, elements);

      if (element) {
        const offsetX = changeX - element.x1;
        const offsetY = changeY - element.y1;
        setSelectedElement({
          ...element,
          offsetX,
          offsetY,
        });
        setElements(prevState => prevState);

        if (element.position === 'inside') {
          setAction('moving');
        } else {
          setAction('resize');
        }
      }
    } else {
      setAction('drawing');
      const createPosition: ElementsPosition = {
        id: Date.now().toString(),
        x1: changeX,
        y1: changeY,
        x2: changeX,
        y2: changeY,
        type: tooltype,
        position: null,
      };

      const updateElement = createElement(createPosition);
      setElements((prevState: ElementsDefain) => [...prevState, updateElement]);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    const { changeX, changeY } = pointerPosition(clientX, clientY);
    if (tooltype === 'selection') {
      const element = getElementAtPosition(changeX, changeY, elements);
      event.currentTarget.style.cursor = element
        ? cursorForPosition(element.position)
        : 'default';
    }

    if (action === 'drawing') {
      const len = elements.length - 1;
      const { id, x1, y1, position } = elements[len];
      const createPosition = {
        id,
        x1,
        y1,
        x2: changeX,
        y2: changeY,
        type: tooltype,
        position,
      };
      updateElement(createPosition);
    } else if (action === 'moving') {
      const { id, x1, x2, y1, y2, type, offsetX, offsetY, position } =
        selectedElement as SelectPosition;
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
        position,
      });
    } else if (action === 'resize') {
      const { id, type, position, ...coordinates } =
        selectedElement as SelectPosition;
      const { x1, y1, x2, y2 } = resizingCoordinates(
        changeX,
        changeY,
        position as string,
        coordinates
      );
      updateElement({
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        position,
      });
    }
  };
  const handleMouseUp = () => {
    if (action === 'drawing' || action === 'resize') {
      const index = elements.length - 1;
      const { id, type, position } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement({ id, x1, y1, x2, y2, type, position });
    }
    setAction('none');
    setSelectedElement(null);
=======
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
>>>>>>> master
  };

  return (
    <>
      <div>
        <input
          type="radio"
<<<<<<< HEAD
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
        <div>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
        </div>
      </div>

=======
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
>>>>>>> master
      <canvas
        ref={canvasRef}
        id="Canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDoun}
        onMouseMove={handleMouseMove}
<<<<<<< HEAD
=======
        onMouseOut={handleMouseOut}
>>>>>>> master
        onMouseUp={handleMouseUp}
      ></canvas>
    </>
  );
}

export default App;
function resizingCoordinates(
  changeX: number,
  changeY: number,
  position: string,
  coordinates: {
    offsetX: number;
    offsetY: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }
) {
  const { x1, y1, x2, y2 } = coordinates;
  switch (position) {
    case 'tl':
    case 'start':
      return { x1: changeX, y1: changeY, x2, y2 };
    case 'bl':
      return { x1: changeX, y1, x2, y2: changeY };
    case 'br':
    case 'end':
      return { x1, y1, x2: changeX, y2: changeY };
    default:
      return { x1, y1: changeY, x2: changeX, y2 };
  }
}
