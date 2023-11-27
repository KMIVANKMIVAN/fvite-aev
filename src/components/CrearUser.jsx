import React, { useState } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useNavigate } from "react-router-dom";

export function CrearUser({ urltable }) {
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const registerUserUrl = `${apiKey}/users`;
  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(registerUserUrl, formData, { headers });

      if (response.data) {
        console.log("SE REGISTRO CORECTAMENTE");
        navigate(urltable);
      }
    } catch (error) {
      console.log("HUBO UN ERROR");
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Stack className="pl-7" spacing={2} direction="row">
        <Button
          variant="outlined"
          endIcon={<AddCircleOutlineOutlinedIcon />}
          onClick={handleClickOpen}
        >
          Crear Usuarios
        </Button>
      </Stack>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form className="space-y-1" onSubmit={handleSubmit}>
          <DialogTitle className="text-center" id="alert-dialog-title">
            {"CREAR USUARIO"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
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
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="">
                  <label htmlFor="nombre" className="  leading-6">
                    Nombres AP. Paterno AP. Materno
                  </label>
                  <input
                    id="nombre"
                    name="nombre"
                    type="text"
                    autoComplete="text"
                    required
                    value={formData.nombre}
                    onChange={handleInputChange}
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
                    required
                    value={formData.superior}
                    onChange={handleInputChange}
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
                    required
                    value={formData.nivel}
                    onChange={handleInputChange}
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
                    required
                    value={formData.idOficina}
                    onChange={handleInputChange}
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
                    required
                    value={formData.dependencia}
                    onChange={handleInputChange}
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
                  required
                  value={formData.cargo}
                  onChange={handleInputChange}
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
                    required
                    value={formData.email}
                    onChange={handleInputChange}
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
                    required
                    value={formData.habilitado}
                    onChange={handleInputChange}
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
                    required
                    value={formData.genero}
                    onChange={(e) =>
                      setFormData({
                        ...formData, // Copiar el estado actual
                        genero: e.target.value,
                      })
                    }
                  >
                    <option value="Seleccionar">Seleccionar</option>
                    <option value="hombre">Masculino</option>
                    <option value="mujer">Femenino</option>
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
                    required
                    value={formData.idEntidad}
                    onChange={handleInputChange}
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
                    required
                    value={formData.cedulaIdentidad}
                    onChange={handleInputChange}
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
                    required
                    value={formData.expedido}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        expedido: e.target.value,
                      })
                    }
                  >
                    <option value="Seleccionar">Seleccionar</option>
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
                    required
                    value={formData.super}
                    onChange={handleInputChange}
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="">
                  <label htmlFor="super" className="  leading-6 ">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="text"
                    autoComplete="text"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              style={{
                color: "red",
                fontWeight: "bold",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "darkred")}
              onMouseOut={(e) => (e.target.style.color = "red")}
            >
              Cerrar
            </Button>
            <Button
              type="submit"
              onClick={handleClose}
              style={{
                color: "green",
                fontWeight: "bold",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.color = "darkgreen")}
              onMouseOut={(e) => (e.target.style.color = "green")}
            >
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
