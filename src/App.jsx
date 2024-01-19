import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UsersTablas } from "./pages/dashboard/userstablas.jsx";
import { Login } from "./pages/login.jsx";

import { Dashboard } from "./pages/dashboard.jsx";
import { DashboardClient } from "./pages/dashboardclient.jsx";

import { ErrorPage } from "./pages/errorpage.jsx";

import { UpdatePassword } from "./pages/updatepassword.jsx";

import { Busafirmar } from "./pages/dashboardclient/busafirmar.jsx";
import { BusaAevFirmados } from "./pages/dashboardclient/busaaevfirmados.jsx";
import { Proyectos } from "./pages/dashboardclient/proyectos.jsx";
import { GastosExtra } from "./pages/dashboardclient/gastosextra.jsx";
import { PagosCut } from "./pages/dashboardclient/pagoscut.jsx";

import RequireAuth from "./utils/requireAuth.jsx";

import fondo from "./assets/fondo.png";

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
        path: "busaaevfirmados",
        element: <BusaAevFirmados />,
      },
      {
        path: "proyectos",
        element: <Proyectos />,
      },
      {
        path: "gastosExtra",
        element: <GastosExtra />,
      },
      {
        path: "pagosCut",
        element: <PagosCut />,
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
