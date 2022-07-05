// 앞으로 가기 뒤로기기 이벤트
function undoRedoFunction(redo: any, undo: any) {
  return function (event: any) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }
    }
  };
}

export { undoRedoFunction };
