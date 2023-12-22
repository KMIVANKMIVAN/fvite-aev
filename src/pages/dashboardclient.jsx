import { useState } from "react";
import { eliminarToken } from "../utils/auth";
import { Outlet } from "react-router-dom";

import Button from "@mui/material/Button";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { useNavigate } from "react-router-dom";

function Submenu() {
  const navigate = useNavigate();

  return (
    <ul className="pl-3 pt-1 text-sm">
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          role="button"
          onClick={() => navigate("/dashboardclient/viviendanueva")}
        >
          {<NavigateNextIcon />}
          <span>Vivienda Nueva</span>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          role="button"
          onClick={() => navigate("/dashboardclient/pemar")}
        >
          {<NavigateNextIcon />}
          <span>PMAR</span>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          role="button"
          onClick={() => navigate("#")}
        >
          {<NavigateNextIcon />}
          <span>Otros Pagos</span>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          role="button"
          onClick={() => navigate("#")}
        >
          {<NavigateNextIcon />}
          <span>Comunidades Urbanas</span>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          role="button"
          onClick={() => navigate("#")}
        >
          {<NavigateNextIcon />}
          <span>Pagos Extraordinarios/Ordinarios</span>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          role="button"
          onClick={() => navigate("#")}
        >
          {<NavigateNextIcon />}
          <span>Incorporacion de Recursos</span>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          role="button"
          onClick={() => navigate("#")}
        >
          {<NavigateNextIcon />}
          <span>Otros Pagos (Estudios)</span>
        </div>
      </li>
    </ul>
  );
}

export function DashboardClient() {
  const navigate = useNavigate();

  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [arrowIcon, setArrowIcon] = useState(<KeyboardArrowDownIcon />);

  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
    setArrowIcon(
      submenuOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />
    );
  };
  return (
    <div className="flex-row lg:flex">
      <div className="flex flex-col w-full p-3 bg-mi-color-secundario text-white shadow lg:h-screen lg:w-72">
        <div className="space-y-3">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">Menu</h2>
          </div>
          <div className="flex-1">
            <ul className="pt-2 pb-4 space-y-1 text-sm">
              <li className="rounded-sm pt-1">
                <div
                  className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-terceario"
                  role="button"
                  onClick={() => navigate("/dashboard/userstablas")}
                >
                  {<SupervisedUserCircleIcon />}
                  <span>Usuarios</span>
                </div>
              </li>
              <li className="rounded-sm">
                <div
                  className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-terceario"
                  onClick={toggleSubmenu}
                >
                  {<AssignmentIcon />}
                  <button>Generacion Intrucciones</button>
                  {arrowIcon}
                </div>
                {submenuOpen && <Submenu />}
              </li>
              <li className="rounded-sm">
                <div
                  className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-terceario"
                  onClick={() => {
                    eliminarToken();
                    window.location.href = "/";
                  }}
                >
                  {<LogoutIcon />}
                  <button>Cerrar Sesion</button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto ">
        <div className="grid grid-cols-1   lg:grid-cols-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
