import { configureStore } from '@reduxjs/toolkit';
import { canvasSlice } from './canvasReduser';
import { toolbarSlice } from './toolbarReduser';
// ...

export const store = configureStore({
  reducer: {
    toolbar: toolbarSlice.reducer,
    canvas: canvasSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
