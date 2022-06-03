import { useState } from 'react';
import { ElementsDefain, setState, Void } from '../type/canvasDefine';

export const useHistory = (
  initalValue: []
): [ElementsDefain, setState, Void, Void] => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<ElementsDefain[]>([initalValue]);
  const setState = (
    action: ElementsDefain | ((prevState: ElementsDefain) => ElementsDefain),
    overwirte = false
  ) => {
    const newState =
      typeof action === 'function' ? action(history[index]) : action;
    if (overwirte) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex(prevIndex => prevIndex + 1);
    }
  };

  const undo = () => index > 0 && setIndex(prevState => prevState - 1);
  const redo = () =>
    index < history.length - 1 && setIndex(prevState => prevState + 1);

  return [history[index], setState, undo, redo];
};
