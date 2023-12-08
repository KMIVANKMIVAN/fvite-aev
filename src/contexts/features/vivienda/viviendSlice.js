// viviendSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedContCod: null,
  updateComponent: 0,
};

const viviendSlice = createSlice({
  name: "viviend",
  initialState,
  reducers: {
    setSelectedContCod(state, action) {
      state.selectedContCod = action.payload;
    },
    incrementUpdateComponent(state) {
      state.updateComponent += 1;
    },
  },
});

export const { setSelectedContCod, incrementUpdateComponent } =
  viviendSlice.actions;
export default viviendSlice.reducer;
