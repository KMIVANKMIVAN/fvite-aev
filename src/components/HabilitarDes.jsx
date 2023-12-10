import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { useDispatch } from "react-redux";
import { setUser } from "../contexts/features/user/userSlice";
import { increment } from "../contexts/features/user/counterUserSlice";

import Switch from "@material-ui/core/Switch";

export function HabilitarDes({ idActualizarUser, selectedHabilitado }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const dispatch = useDispatch();

  console.log("111 selectedHabilitado", selectedHabilitado);

  const [checked, setChecked] = useState(selectedHabilitado === 1);

  useEffect(() => {
    setChecked(selectedHabilitado === 1);
  }, [selectedHabilitado]);

  const handleChange = async (event) => {
    const nuevoEstado = event.target.checked ? 1 : 0;
    setChecked(event.target.checked);

    // Lógica para actualizar el estado
    actualizarEstado(idActualizarUser, nuevoEstado);
  };

  const actualizarEstado = async (idActualizarUser, nuevoEstado) => {
    try {
      const url = `${apiKey}/users/${idActualizarUser}`;
      const token = obtenerToken();

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.patch(
        url,
        { habilitado: nuevoEstado },
        { headers }
      );

      if (response.status === 200) {
        console.log("por que no vas");
        dispatch(setUser(response.data));
        dispatch(increment());
        // navigate(urltable);
      } else {
        console.error("Error al actualizar el estado del usuario");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Switch
        checked={checked}
        onChange={handleChange}
        inputProps={{ "aria-label": "secondary checkbox" }}
        onClick={() => {
          const nuevoEstado = selectedHabilitado === 1 ? 0 : 1;
          actualizarEstado(idActualizarUser, nuevoEstado);
        }}
      />
    </>
  );
}
