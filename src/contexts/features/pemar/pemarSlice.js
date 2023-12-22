// viviendSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCodid: null,
  updateComponent: 0,
};

const pemarSlice = createSlice({
  name: "pemar",
  initialState,
  reducers: {
    setSelectedCodid(state, action) {
      state.selectedCodid = action.payload;
    },
    incrementUpdateComponent(state) {
      state.updateComponent += 1;
    },
  },
});

export const { setSelectedCodid, incrementUpdateComponent } =
  pemarSlice.actions;
export default pemarSlice.reducer;
