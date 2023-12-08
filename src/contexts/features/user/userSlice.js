import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Estado inicial sin ningún usuario
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Establecer el usuario en el estado
    },
    clearUser: (state) => {
      state.user = null; // Limpiar el usuario del estado
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
