import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { Navbar } from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";

import { Provider } from "react-redux";
import { store } from "./contexts/store.js";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import { UsersTablas } from "./pages/dashboard/userstablas.jsx";
// import { UserTablas } from "./pages/dashboard/usertablas.jsx";

import { Dashboard } from "./pages/dashboard.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Provider store={store}>
        <Navbar />
        <App />
        <Footer />
      </Provider>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
