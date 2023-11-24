import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState: initialState,
  reducers: {
    /* setCounter: (state, action) => {
      state.value = action.payload.value;
    },
    unsetCounter: (state) => {
      state.value = 0;
    }, */
    addCounter: (state) => {
      state.value += 1;
    },
    setCounter: (state) => {
      state.value -= 1;
    },
  },
});

export const { addCounter, setCounter } = counterSlice.actions;

export default counterSlice.reducer;
