import React, { useLayoutEffect } from 'react';
import rough from 'roughjs';
const generator = rough.generator();

function App() {
  useLayoutEffect(() => {
    const canvas = document.querySelector('#Vanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    const roughCanvas = rough.canvas(canvas);
    const rect = generator.rectangle(10, 10, 100, 100);
    roughCanvas.draw(rect);
  }, []);
  return (
    <div className="App">
      <canvas
        id="Canvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
}

export default App;
