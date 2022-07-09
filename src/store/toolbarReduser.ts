import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Action, Tool } from '../type/canvasDefine';

interface ToolbarState {
  tooltype: Tool;
  action: Action;
}

const initialState: ToolbarState = {
  tooltype: 'text',
  action: 'none',
};

export const toolbarSlice = createSlice({
  name: 'toolbarState',
  initialState,
  reducers: {
    chageTooltype(state, action: PayloadAction<Tool>) {
      state.tooltype = action.payload;
    },
  },
});

export const { chageTooltype } = toolbarSlice.actions;
export default toolbarSlice.reducer;
