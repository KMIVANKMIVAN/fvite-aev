// requireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { obtenerToken, eliminarToken } from "./auth";
import {
  obtenerUserNivel,
  eliminarUserNivel,
  eliminarUserId,
} from "./userdata"; // Ajusta la importación según tu lógica de manejo de usuario

const RequireAuth = ({ children }) => {
  const token = obtenerToken(); // Obtiene el token del usuario
  const userNivel = obtenerUserNivel(); // Obtiene el nivel del usuario
  const location = useLocation();

  // Verifica si el token o el nivel de usuario no están presentes
  if (!token || !userNivel) {
    eliminarToken(); // Elimina el token
    eliminarUserNivel(); // Elimina el nivel de usuario
    eliminarUserId(); // Elimina el ID del usuario (si es necesario)
    window.location.href = "/"; // Redirige al usuario a la página de inicio de sesión
    return null; // Puedes devolver null aquí para evitar renderizar contenido en este caso
  }

  // Verifica las restricciones de nivel de usuario para las rutas
  const rutaPermitida = (nivelRequerido, rutasPermitidas) => {
    if (userNivel === 1 || rutasPermitidas.includes(location.pathname)) {
      return true; // Si el usuario tiene nivel 1 o la ruta está permitida, permite el acceso
    }
    return false; // Si el usuario no tiene acceso a la ruta, bloquea el acceso
  };

  // Define las rutas permitidas para cada nivel de usuario
  const nivelAcceso = {
    1: [
      "/",
      "/updatepassword",
      "/updatepassword",
      "/dashboard",
      "/dashboardclient",
      "/dashboard/userstablas",
      "/dashboard/usertablas",
      "/dashboardclient/busafirmar",
      "/dashboardclient/viviendanueva",
      "/dashboardclient/pemar",
    ],
    9: [
      "/updatepassword",
      "/dashboardclient/viviendanueva",
      "/dashboardclient/pemar",
    ],
    40: ["/updatepassword", "/dashboardclient/busafirmar"],
  };

  // Verifica si la ruta actual está permitida para el nivel de usuario
  if (!rutaPermitida(userNivel, nivelAcceso[userNivel])) {
    // Si la ruta no está permitida, redirige a la página de inicio de sesión
    eliminarToken();
    eliminarUserNivel();
    eliminarUserId();
    window.location.href = "/";
    return null;
  }

  // Si el token y el nivel de usuario son válidos y permiten el acceso a la ruta, renderiza el contenido de la ruta protegida
  return children;
};

export default RequireAuth;
