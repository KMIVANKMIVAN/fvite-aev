import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UsersTablas } from "./pages/dashboard/userstablas.jsx";
import { UserTablas } from "./pages/dashboard/usertablas.jsx";
import { Login } from "./pages/login.jsx";

import { Dashboard } from "./pages/dashboard.jsx";
import { DashboardClient } from "./pages/dashboardclient.jsx";

import { ErrorPage } from "./pages/errorpage.jsx";

import { UpdatePassword } from "./pages/updatepassword.jsx";

import { ViviendaNueva } from "./pages/dashboardclient/viviendanueva.jsx";
import { Pemar } from "./pages/dashboardclient/pemar.jsx";
import { Busafirmar } from "./pages/dashboardclient/busafirmar.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/updatepassword",
    element: <UpdatePassword />,
    errorElement: <ErrorPage />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "userstablas",
        element: <UsersTablas />,
      },
      {
        path: "usertablas",
        element: <UserTablas />,
      },
    ],
  },
  {
    path: "/dashboardclient",
    element: <DashboardClient />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "busafirmar",
        element: <Busafirmar />,
      },
      {
        path: "viviendanueva",
        element: <ViviendaNueva />,
      },
      {
        path: "pemar",
        element: <Pemar />,
      },
    ],
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
