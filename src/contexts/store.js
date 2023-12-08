import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counter/counterSlice";
import viviendReducer from "./features/vivienda/viviendSlice";
import userReducer from "./features/user/userSlice";
import counterUserReducer from "./features/user/counterUserSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    viviend: viviendReducer,
    user: userReducer,
    counterUser: counterUserReducer,
  },
});
