import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UsersTablas } from "./pages/dashboard/userstablas.jsx";
import { Login } from "./pages/login.jsx";

import { Dashboard } from "./pages/dashboard.jsx";
import { DashboardClient } from "./pages/dashboardclient.jsx";

import { ErrorPage } from "./pages/errorpage.jsx";

import { UpdatePassword } from "./pages/updatepassword.jsx";

import { ViviendaNueva } from "./pages/dashboardclient/viviendanueva.jsx";
import { Pemar } from "./pages/dashboardclient/pemar.jsx";
import { Busafirmar } from "./pages/dashboardclient/busafirmar.jsx";
import { BusaAevFirmados } from "./pages/dashboardclient/busaaevfirmados.jsx";

import RequireAuth from "./utils/requireAuth.jsx";

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
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "userstablas",
        element: <UsersTablas />,
      },
    ],
  },
  {
    path: "/dashboardclient",
    element: (
      <RequireAuth>
        <DashboardClient />
      </RequireAuth>
    ),
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
      {
        path: "busaaevfirmados",
        element: <BusaAevFirmados />,
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
