import React, { useState } from "react";
import { UsersTablas } from "./dashboard/userstablas.jsx";
import { UserTablas } from "./dashboard/usertablas.jsx";

import { eliminarToken } from "../utils/auth";

function Submenu() {
  // const router = useRouter();
  return (
    <ul className="pl-3 pt-1 text-sm">
      <li className="rounded-sm">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          // onClick={() => router.push("/pages/dashboardclient/viviendanueva")}
        >
          <button>Vivienda Nueva</button>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          // onClick={() => router.push("/submenu-option-2")}
        >
          <button>PMAR</button>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          // onClick={() => router.push("/submenu-option-2")}
        >
          <button>Otros Pagos</button>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          // onClick={() => router.push("/submenu-option-2")}
        >
          <button>Comunidades Urbanas</button>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          // onClick={() => router.push("/submenu-option-2")}
        >
          <button>Pagos Extraordinarios/Ordinarios</button>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          // onClick={() => router.push("/submenu-option-2")}
        >
          <button>Incorporacion de Recursos</button>
        </div>
      </li>
      <li className="rounded-sm pt-1">
        <div
          className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-cuartario"
          // onClick={() => router.push("/submenu-option-2")}
        >
          <button>Otros Pagos (Estudios)</button>
        </div>
      </li>
    </ul>
  );
}

export function Dashboard() {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  return (
    <>
      <div className="flex-row lg:flex">
        <div className="flex flex-col w-full p-3 bg-mi-color-secundario text-white shadow lg:h-screen lg:w-72">
          <div className="space-y-3">
            <div className="flex items-center">
              <h2 className="text-xl font-bold">Menu</h2>
            </div>
            <div className="flex-1">
              <ul className="pt-2 pb-4 space-y-1 text-sm">
                <li className="rounded-sm">
                  <div
                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-terceario"
                    // onClick={() => router.push("/pages/dashboard/usertablas")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <button>Usuarios</button>
                  </div>
                </li>
                <li className="rounded-sm">
                  <div
                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-terceario"
                    onClick={() => setSubmenuOpen(!submenuOpen)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                    <button>Generacion Intrucciones</button>
                  </div>
                  {submenuOpen && <Submenu />}
                </li>
                <li className="rounded-sm">
                  <div
                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-terceario"
                    // onClick={() => router.push("/mail")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <button>Orders</button>
                  </div>
                </li>
                <li className="rounded-sm">
                  <div
                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-terceario"
                    // onClick={() => router.push("/mail")}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <button>Settings</button>
                  </div>
                </li>
                <li className="rounded-sm">
                  <div
                    className="flex items-center p-2 space-x-3 rounded-md hover:bg-mi-color-primario bg-mi-color-terceario"
                    onClick={() => {
                      eliminarToken();
                      window.location.href = "/";
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <button>Cerrar Sesion</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mx-auto ">
          <div className="grid grid-cols-1   lg:grid-cols-1">
            <UsersTablas />
          </div>
        </div>
      </div>
    </>
  );
}
