import { useState } from "react";
import { Outlet } from "react-router-dom";

import { eliminarToken } from "../utils/auth";
import {
  obtenerUserNivel,
  eliminarUserNivel,
  eliminarUserId,
} from "../utils/userdata";

import ArticleIcon from "@mui/icons-material/Article";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GiteIcon from "@mui/icons-material/Gite";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useNavigate } from "react-router-dom";

function Submenu() {
  const navigate = useNavigate();
  return (
    <ul className="pl-3 pt-1 text-white text-sm">
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-c4p2 bg-c3p2"
          role="button"
          onClick={() => navigate("/dashboardclient/proyectos")}
        >
          {<GiteIcon />}
          <span>Proyectos</span>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-c4p2 bg-c3p2"
          role="button"
          onClick={() => navigate("/dashboardclient/gastosextra")}
        >
          {<AssessmentIcon />}
          <span>Gastos Extraudinarios</span>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-c4p2 bg-c3p2"
          role="button"
          onClick={() => navigate("/dashboardclient/pagoscut")}
        >
          {<ArticleIcon />}
          <span>Pagos C.U.T.</span>
        </div>
      </li>

      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-c4p2 bg-c3p2"
          role="button"
          onClick={() => navigate("/dashboardclient/busaaevfirmados")}
        >
          {<AssignmentTurnedInIcon />}
          <span>Firmados AEV y BUSA</span>
        </div>
      </li>
    </ul>
  );
}
export function Dashboard() {
  const navigate = useNavigate();

  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [arrowIcon, setArrowIcon] = useState(<KeyboardArrowDownIcon />);

  const toggleSubmenu = () => {
    setSubmenuOpen(!submenuOpen);
    setArrowIcon(
      submenuOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />
    );
  };
  const handleRedirect = (url) => {
    window.open(url, "_blank");
  };
  return (
    <>
      <div className="flex-row lg:flex">
        <div className="flex flex-col w-full px-3 pt-5 bg-c1p2 shadow lg:w-72">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <li className="rounded-sm">
              <div
                className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-c4p2 bg-c2p2"
                role="button"
                onClick={() =>
                  handleRedirect("https://firmadigital.bo/jacobitus4/")
                }
              >
                <TouchAppIcon />
                <span>JACOBITUS TOTAL</span>
              </div>
            </li>
            <li className="rounded-sm">
              <div
                className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-c4p2 bg-c2p2"
                role="button"
                onClick={() => navigate("/dashboard/userstablas")}
              >
                {<SupervisedUserCircleIcon />}
                <span>Usuarios</span>
              </div>
            </li>
            <li className="rounded-sm">
              <div
                className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-c4p2 bg-c2p2"
                role="button"
                onClick={() => navigate("/dashboardclient/busafirmar")}
              >
                {<AccountBalanceIcon />}
                <span>BUSA</span>
              </div>
            </li>
            <li className="rounded-sm">
              <div
                className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-c4p2 bg-c2p2"
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
                className="flex items-center p-2 space-x-3 rounded-md text-white hover:bg-c4p2 bg-c2p2"
                onClick={() => {
                  eliminarToken();
                  eliminarUserNivel();
                  eliminarUserId();
                  window.location.href = "/";
                }}
              >
                {<LogoutIcon />}
                <button>Cerrar Sesion</button>
              </div>
            </li>
          </ul>
        </div>
        <div className="container mx-auto ">
          <div className="grid grid-cols-1   lg:grid-cols-1">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
