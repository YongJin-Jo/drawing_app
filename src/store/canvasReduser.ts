import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { SelectPosition } from '../type/canvasDefine';

interface CanvasState {
  selectedElement: SelectPosition | null;
}

const initialState: CanvasState = {
  selectedElement: null,
};

export const canvasSlice = createSlice({
  name: 'toolbarState',
  initialState,
  reducers: {
    changeSelectedElement(
      state,
      actions: PayloadAction<SelectPosition | null>
    ) {
      state.selectedElement = actions.payload;
    },
  },
});

export const { changeSelectedElement } = canvasSlice.actions;
export default canvasSlice.reducer;
