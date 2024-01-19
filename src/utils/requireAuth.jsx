import { useLocation } from "react-router-dom";
import { obtenerToken, eliminarToken } from "./auth";
import {
  obtenerUserNivel,
  eliminarUserNivel,
  eliminarUserId,
} from "./userdata";

const RequireAuth = ({ children }) => {
  const token = obtenerToken();
  const userNivel = obtenerUserNivel();
  const location = useLocation();

  if (!token || !userNivel) {
    eliminarToken();
    eliminarUserNivel();
    eliminarUserId();
    window.location.href = "/";
    return null;
  }

  const rutaPermitida = (nivelRequerido, rutasPermitidas) => {
    if (userNivel === 1 || rutasPermitidas.includes(location.pathname)) {
      return true;
    }
    return false;
  };
  const nivelAcceso = {
    1: [
      "/",
      "/updatepassword",
      "/updatepassword",
      "/dashboard",
      "/dashboardclient",
      "/dashboard/userstablas",
      "/dashboardclient/busafirmar",
      "/dashboardclient/busaaevfirmados",
      "/dashboardclient/gastosextra",
      "/dashboardclient/pagoscut",
      "/dashboardclient/proyectos",
    ],
    9: [
      "/",

      "/updatepassword",
      "/dashboardclient/busaaevfirmados",
      "/dashboardclient/gastosextra",
      "/dashboardclient/pagoscut",
      "/dashboardclient/proyectos",
    ],
    40: ["/", "/updatepassword", "/dashboardclient/busafirmar"],
  };

  if (!rutaPermitida(userNivel, nivelAcceso[userNivel])) {
    eliminarToken();
    eliminarUserNivel();
    eliminarUserId();
    window.location.href = "/";
    return null;
  }

  return children;
};

export default RequireAuth;
