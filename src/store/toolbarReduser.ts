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
    changeTooltype(state, action: PayloadAction<Tool>) {
      state.tooltype = action.payload;
    },
    changeAction(state, actions: PayloadAction<Action>) {
      state.action = actions.payload;
    },
  },
});

export const { changeTooltype, changeAction } = toolbarSlice.actions;
export default toolbarSlice.reducer;
