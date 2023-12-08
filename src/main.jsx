import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";

import { Provider } from "react-redux";
import { store } from "./contexts/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Navbar />
      <App />
      <Footer />
    </Provider>
  </React.StrictMode>
);
