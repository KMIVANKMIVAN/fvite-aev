import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Navbar } from "./components/Navbar.jsx";

import { Provider } from "react-redux";
import { store } from "./contexts/store.js";

import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      main: "#028ac7",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Navbar />
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
      {/* <Footer /> */}
    </Provider>
  </React.StrictMode>
);
