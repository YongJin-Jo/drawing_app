import { useState } from 'react';
import { ElementsDefain, setState } from '../type/canvasDefine';

export const useHistory = (initalValue: []): [ElementsDefain, setState] => {
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
      setHistory(prevState => [...prevState, newState]);
      setIndex(prevIndex => prevIndex + 1);
    }
  };
  return [history[index], setState];
};
