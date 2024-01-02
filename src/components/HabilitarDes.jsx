import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { useDispatch } from "react-redux";
import { setUser } from "../contexts/features/user/userSlice";
import { increment } from "../contexts/features/user/counterUserSlice";

import Switch from "@material-ui/core/Switch";

const label = { inputProps: { "aria-label": "Color switch demo" } };

export function HabilitarDes({ idActualizarUser, selectedHabilitado }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const dispatch = useDispatch();
  const [respuestasError, setErrorRespuestas] = useState(null);

  const [checked, setChecked] = useState(selectedHabilitado === 1);

  useEffect(() => {
    setChecked(selectedHabilitado === 1);
  }, [selectedHabilitado]);

  const handleChange = async (event) => {
    const nuevoEstado = event.target.checked ? 1 : 0;
    setChecked(event.target.checked);
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
        setErrorRespuestas(null);
        dispatch(setUser(response.data));
        dispatch(increment());
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorRespuestas(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorRespuestas(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorRespuestas("RF: No se pudo obtener respuesta del servidor");
      } else {
        setErrorRespuestas("RF: Error al enviar la solicitud");
      }
    }
  };

  return (
    <>
      {respuestasError && (
        <p className="text-red-700 text-center p-5">{respuestasError}</p>
      )}
      <Switch
        checked={checked}
        onChange={handleChange}
        {...label}
        defaultChecked
        color="secondary"
        onClick={() => {
          const nuevoEstado = selectedHabilitado === 1 ? 0 : 1;
          actualizarEstado(idActualizarUser, nuevoEstado);
        }}
      />
    </>
  );
}
