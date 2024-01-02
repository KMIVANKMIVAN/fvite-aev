import React, { useState } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";

import { useDispatch } from "react-redux";
import { setUser } from "../contexts/features/user/userSlice";
import { increment } from "../contexts/features/user/counterUserSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function ActualizarUser({ idActualizarUser }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [userData, setUserData] = useState({
    id: idActualizarUser,
    username: "",
    superior: "",
    idOficina: "",
    dependencia: "",
    nombre: "",
    cargo: "",
    email: "",
    habilitado: "",
    nivel: "",
    genero: "",
    prioridad: "",
    idEntidad: "",
    super: "",
    cedulaIdentidad: "",
    expedido: "",
  });
  const [erroruserData, setErroruserData] = useState(null);
  const [errorUpdate, setErrorUpdate] = useState(null);

  async function fetchUserData() {
    if (!userData.username) {
      const getOneUrl = `${apiKey}/users/id/${idActualizarUser}`;
      try {
        const response = await axios.get(getOneUrl, { headers });
        if (response.status === 200) {
          setErroruserData(null);
          setUserData(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400) {
            setErroruserData(`RS: ${data.message}`);
          } else if (status === 500) {
            setErroruserData(`RS: ${data.message}`);
          }
        } else if (error.request) {
          setErroruserData("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErroruserData("RF: Error al enviar la solicitud");
        }
      }
    }
  }

  fetchUserData();

  const handleInputUpdate = (e) => {
    const { name, value } = e.target;
    let uppercaseValue = value;
    if (
      name === "nombre" ||
      name === "genero" ||
      name === "expedido" ||
      name === "cargo"
    ) {
      uppercaseValue = value.toUpperCase();
    }

    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: uppercaseValue,
    }));
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    const updateUrl = `${apiKey}/users/${userData.id}`;
    try {
      const response = await axios.patch(updateUrl, userData, { headers });
      if (response.data) {
        setErrorUpdate(null);
        dispatch(setUser(response.data));
        dispatch(increment());
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorUpdate(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorUpdate(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorUpdate("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorUpdate("RF: Error al enviar la solicitud");
      }
    }
  };

  const [expanded, setExpanded] = useState(false);

  const handleButtonClick = () => {
    setExpanded(!expanded);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {userData.username !== "" && (
        <>
          <EditIcon className="text-red-500" onClick={handleClickOpen} />
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
          >
            <DialogContent>
              {erroruserData && (
                <p className="text-red-700 text-center">{erroruserData}</p>
              )}
              <h1 className="text-center pb-5">ACTUALIZAR USUARIO</h1>
              <form className="space-y-1" onSubmit={handleSubmitUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 pb-2 gap-4">
                  <div className="">
                    <label htmlFor="username" className="  leading-6">
                      Nombre de Usuario
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="text"
                      value={userData.username}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="nombre" className="  leading-6">
                      Nombre
                    </label>
                    <input
                      id="nombre"
                      name="nombre"
                      type="text"
                      autoComplete="text"
                      value={userData.nombre}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 pb-2 gap-4">
                  <div className="">
                    <label htmlFor="superior" className="  leading-6 ">
                      Superior
                    </label>
                    <input
                      id="superior"
                      name="superior"
                      type="text"
                      autoComplete="text"
                      value={userData.superior}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="nivel" className="  leading-6 ">
                      Nivel
                    </label>
                    <input
                      id="nivel"
                      name="nivel"
                      type="text"
                      autoComplete="text"
                      value={userData.nivel}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 pb-2 gap-4">
                  <div className="">
                    <label htmlFor="idOficina" className="  leading-6">
                      ID de Oficina
                    </label>
                    <input
                      id="idOficina"
                      name="idOficina"
                      type="text"
                      autoComplete="text"
                      value={userData.idOficina}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="dependencia" className="  leading-6 ">
                      Dependencia
                    </label>
                    <input
                      id="dependencia"
                      name="dependencia"
                      type="text"
                      autoComplete="text"
                      value={userData.dependencia}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="pb-2">
                  <label htmlFor="cargo" className="  leading-6 ">
                    Cargo
                  </label>
                  <input
                    id="cargo"
                    name="cargo"
                    type="text"
                    autoComplete="text"
                    value={userData.cargo}
                    onChange={handleInputUpdate}
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 pb-2 gap-4">
                  <div className="">
                    <label htmlFor="email" className="  leading-6 ">
                      Correo
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="text"
                      value={userData.email}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="">
                    <label htmlFor="habilitado" className="  leading-6 ">
                      Habilitado
                    </label>
                    <input
                      id="habilitado"
                      name="habilitado"
                      type="text"
                      autoComplete="text"
                      value={userData.habilitado}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 pb-2 gap-4">
                  <div>
                    <label htmlFor="genero" className="  leading-6 ">
                      Género
                    </label>
                    <select
                      id="genero"
                      name="genero"
                      className="text-white border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-indigo-600"
                      value={userData.genero}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          genero: e.target.value,
                        })
                      }
                    >
                      <option value="HOMBRE">Masculino</option>
                      <option value="MUJER">Femenino</option>
                    </select>
                  </div>
                  <div className="">
                    <label htmlFor="idEntidad" className="  leading-6 ">
                      ID Entidad
                    </label>
                    <input
                      id="idEntidad"
                      name="idEntidad"
                      type="text"
                      autoComplete="text"
                      value={userData.idEntidad}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 pb-2 gap-4">
                  <div className="">
                    <label htmlFor="cedulaIdentidad" className="  leading-6 ">
                      Cedula de Identidad
                    </label>
                    <input
                      id="cedulaIdentidad"
                      name="cedulaIdentidad"
                      type="text"
                      autoComplete="text"
                      value={userData.cedulaIdentidad}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <label htmlFor="expedido" className="leading-6 ">
                      Expendio
                    </label>
                    <select
                      id="expedido"
                      name="expedido"
                      className="text-white border border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-indigo-600"
                      value={userData.expedido}
                      onChange={(e) =>
                        setUserData({
                          ...userData,
                          expedido: e.target.value,
                        })
                      }
                    >
                      <option value="LPZ">LPZ</option>
                      <option value="OR">OR</option>
                      <option value="CB">CB</option>
                      <option value="CH">CH</option>
                      <option value="SC">SC</option>
                      <option value="BE">BE</option>
                      <option value="PD">PD</option>
                      <option value="PT">PT</option>
                      <option value="TJ">TJ</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 pb-2 gap-4">
                  <div className="">
                    <label htmlFor="super" className="  leading-6 ">
                      Super
                    </label>
                    <input
                      id="super"
                      name="super"
                      type="text"
                      autoComplete="text"
                      value={userData.super}
                      onChange={handleInputUpdate}
                      className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div></div>
                </div>
                <div className="flex justify-between">
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    onClick={() => {
                      handleButtonClick();
                      handleClose();
                    }}
                  >
                    Guardar
                    <SaveIcon />
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="contained"
                    color="error"
                  >
                    Cerrar
                  </Button>
                </div>

                {errorUpdate && (
                  <p className="text-red-700 text-center">{errorUpdate}</p>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
}
