import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  isTextReWriteing,
  resizingCoordinates,
} from './util/canvars/drawing_action';
import {
  adjustElementCoordinates,
  CalculatesMovingPoints,
} from './util/canvars/math';
import { cloneDeep } from 'lodash';
import { undoRedoFunction } from './util/canvars/keybordEvent';
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [tooltype, setTooltype] = useState<Tool>('text');
  const [selectedElement, setSelectedElement] = useState<SelectPosition | null>(
    null
  );
  const [elements, setElements, undo, redo] = useHistory({});
  const [action, setAction] = useState<Action>('none');

  useLayoutEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    const core = canversTarget(canvas);
    Object.values(elements).forEach(data => core(data));
  }, [elements]);

  useEffect(() => {
    const undoRedo = undoRedoFunction(redo, undo);
    document.addEventListener('keydown', undoRedo);
    return () => {
      document.removeEventListener('keydown', undoRedo);
    };
  }, [undo, redo]);

  useEffect(() => {
    if (action === 'writing') {
      const textarea = textAreaRef.current as HTMLTextAreaElement;
      textarea.focus;
      textarea.value = selectedElement?.text as string;
    }
  }, [action, selectedElement]);

  const updateElement = ({
    id,
    type,
    position,
    points,
    text,
  }: ElementsInfo) => {
    const elementsCopy = { ...elements };

    switch (type) {
      case 'line':
      case 'rect': {
        const updatedEleElement = createElement({
          id,
          type,
          position,
          points,
        });
        const { x1, y1, x2, y2 } = adjustElementCoordinates(updatedEleElement);

        elementsCopy[id] = {
          id,
          type,
          position: null,
          points: [{ x1, y1, x2, y2 }],
        };
        break;
      }
      case 'pencil': {
        const [{ x1, y1 }] = points as ElementsPencilPosition[];

        elementsCopy[id].points = [
          ...(elementsCopy[id].points as ElementsPencilPosition[]),
          { x1, y1 },
        ];
        break;
      }
      case 'text': {
        const [{ x1, y1 }] = points;
        const canvas = canvasRef.current as HTMLCanvasElement;
        const textWidth = canvas.getContext('2d')?.measureText(text as string)
          .width as number;
        const textHeight = 48;
        elementsCopy[id] = {
          id,
          points: [{ x1, y1, x2: x1 + textWidth, y2: y1 + textHeight }],
          position,
          type,
          text,
        };

        break;
      }
      default:
        throw new Error('not fount type');
    }

    setElements(elementsCopy, true);
  };

  const handleMouseDoun = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (action === 'writing') return;

    const { clientX, clientY } = event;

    if (tooltype === 'selection') {
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        let offsetX: number | number[];
        let offsetY: number | number[];

        if (element.type === 'pencil') {
          offsetX = element.points.map(point => {
            const x1 = clientX - point.x1;
            return x1;
          });
          offsetY = element.points.map(point => {
            const y1 = clientY - point.y1;
            return y1;
          });
        } else {
          offsetX = clientX - element.points[0].x1;
          offsetY = clientY - element.points[0].y1;
        }

        setSelectedElement({
          ...element,
          offsetX,
          offsetY,
        });

        setElements(prevState => prevState);

        // Action 상태값 변경
        element.position === 'inside'
          ? setAction('moving')
          : setAction('resize');
      }
      return;
    }

    setAction(tooltype === 'text' ? 'writing' : 'drawing');

    const createPosition: ElementsInfo = {
      id: Date.now().toString(),
      type: tooltype,
      position: null,
      points:
        tooltype === 'pencil' || tooltype === 'text'
          ? [{ x1: clientX, y1: clientY }]
          : [{ x1: clientX, y1: clientY, x2: clientX, y2: clientY }],
    };

    const updateElement = createElement(createPosition);
    setSelectedElement({ ...updateElement, offsetX: 0, offsetY: 0 });
    setElements((prevState: ElementsList) => {
      return { ...prevState, [createPosition.id]: updateElement };
    });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (tooltype === 'selection' && action != 'writing') {
      const element = getElementAtPosition(clientX, clientY, elements);

      // mouseCursor Style 변경
      event.currentTarget.style.cursor = element
        ? cursorForPosition(element.position)
        : 'default';
    }
    if (action === 'drawing') {
      const { id, position, points, type } = selectedElement as SelectPosition;
      const pointIndex = points.length - 1;

      switch (type) {
        case 'line':
        case 'rect': {
          points[pointIndex] = {
            x1: points[pointIndex].x1,
            y1: points[pointIndex].y1,
            x2: clientX,
            y2: clientY,
          };

          updateElement({ id, position, points, type: tooltype });
          break;
        }
        case 'pencil': {
          updateElement({
            id,
            type: tooltype,
            position,
            points: [
              {
                x1: clientX,
                y1: clientY,
              },
            ],
          });
          break;
        }
      }
      return;
    }

    if (action === 'moving') {
      const { id, type, offsetX, offsetY, position, points, text } =
        selectedElement as SelectPosition;

      if (selectedElement?.type === 'pencil') {
        const offsetXList = offsetX as number[];
        const offsetYList = offsetY as number[];
        const newPoints = selectedElement.points.map((_, index) => {
          return {
            x1: clientX - offsetXList[index],
            y1: clientY - offsetYList[index],
          };
        });

        const elementsCopy = cloneDeep(elements);
        elementsCopy[id].points = [...newPoints];
        setElements(elementsCopy, true);
        return;
      }

      const pointsCopy = cloneDeep(points) as ElementsPosition[];

      const Index = pointsCopy.length - 1;

      const { newX1, newY1, w, h } = CalculatesMovingPoints(
        points as ElementsPosition[],
        clientX,
        clientY,
        offsetX as number,
        offsetY as number
      );

      pointsCopy[Index] = {
        x1: newX1,
        y1: newY1,
        x2: newX1 + w,
        y2: newY1 + h,
      };

      updateElement({
        id,
        type,
        position,
        points: pointsCopy,
        text,
      });

      return;
    }

    if (action === 'resize') {
      const { id, type, position, points } = selectedElement as SelectPosition;
      const { x1, y1, x2, y2 } = resizingCoordinates(
        clientX,
        clientY,
        position as string,
        points as ElementsPosition[]
      );

      updateElement({
        id,
        type,
        position,
        points: [{ x1, y1, x2, y2 }],
      });
      return;
    }
  };
  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { clientX, clientY } = event;
    if (selectedElement != null) {
      const isTextChange = isTextReWriteing(selectedElement, clientX, clientY);

      if (isTextChange) {
        event.currentTarget.style.cursor = 'default';
        setAction('writing');
        return;
      }
      const { id, type, position, text } = selectedElement as SelectPosition;
      const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[id]);
      updateElement({ id, type, position, points: [{ x1, y1, x2, y2 }], text });
    }
    if (action === 'writing') return;

    setAction('none');
    setSelectedElement(null);
  };

  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    const { id, points, type, position } = selectedElement as SelectPosition;
    setAction('none');
    setSelectedElement(null);
    updateElement({
      id,
      type,
      position,
      points,
      text: event.currentTarget.value,
    });
  };
  return (
    <>
      <div style={{ display: 'flex', position: 'fixed', top: 0 }}>
        <div style={{ display: 'flex' }}>
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
          <input
            type="radio"
            checked={tooltype === 'text'}
            onChange={() => {
              setTooltype('text');
            }}
          />
          <label htmlFor="text">Text</label>
        </div>
        <div>
          <button onClick={undo}>Undo</button>
          <button onClick={redo}>Redo</button>
        </div>
      </div>
      {action === 'writing' ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: 'fixed',
            left: Object.values(elements)[Object.keys(elements).length - 1]
              .points[0].x1,
            top: Object.values(elements)[Object.keys(elements).length - 1]
              .points[0].y1,
            font: '24px sans-serif',
            margin: 0,
            borderStyle: 'dashed',
            outline: 0,
            overflow: 'hidden',
            whiteSpace: 'pre',
          }}
        />
      ) : null}

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
