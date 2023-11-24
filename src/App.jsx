// import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UsersTablas } from "./pages/dashboard/userstablas.jsx";
import { UserTablas } from "./pages/dashboard/usertablas.jsx";
import { Login } from "./pages/login.jsx";

import { ErrorPage } from "./pages/errorpage.jsx";

/* const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/userstablas",
    element: <UsersTablas />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/usertablas",
    element: <UserTablas />,
    // errorElement: <ErrorPage />,
  },
]); */

function App() {
  return (
    <>
      {/* <RouterProvider router={router} /> */}
      <Login />
    </>
  );
}

export default App;
