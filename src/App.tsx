import React, { useLayoutEffect, useRef, useState } from 'react';
import { useHistory } from './hooks/hook';
import {
  Action,
  ElementsList,
  ElementsInfo,
  SelectPosition,
  Tool,
  ElementsPosition,
  ElementsPencilPosition,
} from './type/canvasDefine';
import { cursorForPosition } from './util/canvars/cursorStyle';
import {
  canversTarget,
  createElement,
  getElementAtPosition,
  pointerPosition,
  resizingCoordinates,
} from './util/canvars/drawing_action';
import { adjustElementCoordinates } from './util/canvars/math';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltype, setTooltype] = useState<Tool>('pencil');
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

  const updateElement = ({ id, type, position, points }: ElementsInfo) => {
    const elementsCopy = [...elements];
    const findindex = elementsCopy.findIndex(item => item.id === id);
    switch (type) {
      case 'line':
      case 'rect': {
        const [{ x1, y1, x2, y2 }] = points as ElementsPosition[];
        const updatedEleElement = createElement({
          id,
          type,
          position,
          points: [{ x1, y1, x2, y2 }],
        });
        const adjustElement = adjustElementCoordinates(updatedEleElement);

        elementsCopy[findindex] = {
          id,
          type,
          position: null,
          points: [
            {
              x1: adjustElement.x1,
              y1: adjustElement.y1,
              x2: adjustElement.x2,
              y2: adjustElement.y2,
            },
          ],
        };
        break;
      }
      case 'pencil': {
        const [{ x1, y1 }] = points as ElementsPencilPosition[];

        elementsCopy[findindex].points = [
          ...(elementsCopy[findindex].points as ElementsPencilPosition[]),
          { x1, y1 },
        ];
        break;
      }
      default:
        throw new Error('not fount type');
    }
    setElements(elementsCopy, true);
  };

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    const { changeX, changeY } = pointerPosition(clientX, clientY);
    if (tooltype === 'selection') {
      const element = getElementAtPosition(changeX, changeY, elements);
      if (element) {
        if (element.type === 'pencil') {
          const offsetX = element.points.map(point => {
            const x1 = changeX - point.x1;
            return x1;
          });
          const offsetY = element.points.map(point => {
            const y1 = changeY - point.y1;
            return y1;
          });

          setSelectedElement({
            ...element,
            offsetX,
            offsetY,
          });
        } else {
          const offsetX = changeX - element.points[0].x1;
          const offsetY = changeY - element.points[0].y1;
          setSelectedElement({
            ...element,
            offsetX,
            offsetY,
          });
        }

        setElements(prevState => prevState);

        if (element.position === 'inside') {
          setAction('moving');
        } else {
          setAction('resize');
        }
      }
    } else {
      setAction('drawing');
      let createPosition: ElementsInfo;
      if (tooltype === 'pencil') {
        createPosition = {
          id: Date.now().toString(),
          type: tooltype,
          position: null,
          points: [{ x1: changeX, y1: changeY }],
        };
      } else {
        createPosition = {
          id: Date.now().toString(),
          type: tooltype,
          position: null,
          points: [{ x1: changeX, y1: changeY, x2: changeX, y2: changeY }],
        };
      }

      const updateElement = createElement(createPosition);
      setElements((prevState: ElementsList) => [...prevState, updateElement]);
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
      const { id, position, points, type } = elements[len];
      const pointIndex = points.length - 1;
      switch (type) {
        case 'line':
        case 'rect': {
          points[pointIndex] = {
            x1: points[pointIndex].x1,
            y1: points[pointIndex].y1,
            x2: changeX,
            y2: changeY,
          };

          const createPosition = {
            id,
            type: tooltype,
            position,
            points,
          };
          updateElement(createPosition);
          break;
        }
        case 'pencil': {
          const createPosition = {
            id,
            type: tooltype,
            position,
            points: [
              {
                x1: changeX,
                y1: changeY,
              },
            ],
          };
          updateElement(createPosition);
          break;
        }
      }
    } else if (action === 'moving') {
      const { id, type, offsetX, offsetY, position, points } =
        selectedElement as SelectPosition;
      if (selectedElement?.type === 'pencil') {
        const offsetXList = offsetX as number[];
        const offsetYList = offsetY as number[];
        const newPoints = selectedElement.points.map((_, index) => {
          return {
            x1: changeX - offsetXList[index],
            y1: changeY - offsetYList[index],
          };
        });
        console.log(newPoints);

        const elementsCopy = [...elements];
        const findIndex = elementsCopy.findIndex(itme => itme.id === id);
        elementsCopy[findIndex].points = [...newPoints];
        setElements(elementsCopy, true);
      } else {
        const Index = points.length - 1;
        const prevPoints = points[Index] as ElementsPosition;
        const w = prevPoints.x2 - prevPoints.x1;
        const h = prevPoints.y2 - prevPoints.y1;
        const newX1 = changeX - (offsetX as number);
        const newY1 = changeY - (offsetY as number);

        points[Index] = {
          x1: newX1,
          y1: newY1,
          x2: newX1 + w,
          y2: newY1 + h,
        };

        updateElement({
          id,
          type,
          position,
          points,
        });
      }
    } else if (action === 'resize') {
      const { id, type, position, points } = selectedElement as SelectPosition;
      const { x1, y1, x2, y2 } = resizingCoordinates(
        changeX,
        changeY,
        position as string,
        points as ElementsPosition[]
      );

      updateElement({
        id,
        type,
        position,
        points: [{ x1, y1, x2, y2 }],
      });
    }
  };
  const handleMouseUp = () => {
    if (action === 'drawing' || action === 'resize') {
      const index = elements.length - 1;
      const { id, type, position } = elements[index];
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
      updateElement({ id, type, position, points: [{ x1, y1, x2, y2 }] });
    }
    setAction('none');
    setSelectedElement(null);
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
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
          <input
            type="radio"
            checked={tooltype === 'pencil'}
            onChange={() => {
              setTooltype('pencil');
            }}
          />
          <label htmlFor="Pencil">Pencil</label>
        </div>
        <div>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
        </div>
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
