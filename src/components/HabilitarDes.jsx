import { useState, useEffect } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import { useDispatch } from "react-redux";
import { setUser } from "../contexts/features/user/userSlice";
import { increment } from "../contexts/features/user/counterUserSlice";

import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#EF4444" : "#EF4444",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

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
      {/* <Switch
        defaultChecked
        size="small"
        checked={checked}
        onChange={handleChange}
        onClick={() => {
          const nuevoEstado = selectedHabilitado === 1 ? 0 : 1;
          actualizarEstado(idActualizarUser, nuevoEstado);
        }}
      /> */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography>Des.</Typography>
        <AntSwitch
          defaultChecked
          inputProps={{ "aria-label": "ant design" }}
          size="small"
          checked={checked}
          onChange={handleChange}
          onClick={() => {
            const nuevoEstado = selectedHabilitado === 1 ? 0 : 1;
            actualizarEstado(idActualizarUser, nuevoEstado);
          }}
        />
        <Typography>Hab.</Typography>
      </Stack>
    </>
  );
}
