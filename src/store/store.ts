import { configureStore } from '@reduxjs/toolkit';
import { toolbarSlice } from './toolbarReduser';
// ...

export const store = configureStore({
  reducer: {
    toolbar: toolbarSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
