import React, { useState, useEffect } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import DialogContentText from "@mui/material/DialogContentText";
import DialogContent from "@mui/material/DialogContent";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import { useDispatch } from "react-redux";
import { setUser } from "../contexts/features/user/userSlice";
import { increment } from "../contexts/features/user/counterUserSlice";

import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";

import BorderColorIcon from "@mui/icons-material/BorderColor";

export function AsignarFirmadorUser({ userId }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const token = obtenerToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const [userData, setUserData] = useState({
    firmador: "",
    usuario: userId,
  });
  const [erroruserData, setErroruserData] = useState(null);
  const [errorUpdate, setErrorUpdate] = useState(null);

  const [firmadores, setFirmadores] = useState(null);
  const [errorFirmadores, setErrorFirmadores] = useState(null);

  const [idFirmUsu, setIdFirmUsu] = useState(null);
  const [errorIdFirmUsu, setErrorIdFirmUsu] = useState(null);

  const [firmadoresUsuarios, setCrearFirmadoresUsuarios] = useState(null);
  const [errorFirmadoresUsuarios, setErrorFirmadoresUsuarios] = useState(null);

  const [selectedCargo, setSelectedCargo] = useState(null);
  const [selectedCargo2, setSelectedCargo2] = useState(null);

  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    const mostrarIdFirmadorUsuario = async () => {
      try {
        const url = `${apiKey}/firmadorusuario/mostrarporusuarios/${userId}`;
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorIdFirmUsu(null);
          setIdFirmUsu(response.data);
          if (response.data.length > 0) {
            setSelectedCargo2(response.data[0].cargo);
            // setSelectedCargo2(response.data[0].firmador);
          }
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400 || status === 500) {
            setErrorIdFirmUsu(`RS: ${data.error}`);
          }
        } else if (error.request) {
          setErrorIdFirmUsu("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErrorIdFirmUsu("RF: Error al enviar la solicitud");
        }
      }
    };
    mostrarIdFirmadorUsuario();
  }, []);

  useEffect(() => {
    const mostrarFirmador = async () => {
      try {
        const url = `${apiKey}/firmador/findalldepartamento`;
        const response = await axios.get(url, { headers });

        if (response.status === 200) {
          setErrorFirmadores(null);
          setFirmadores(response.data);
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response;
          if (status === 400 || status === 500) {
            setErrorFirmadores(`RS: ${data.error}`);
          }
        } else if (error.request) {
          setErrorFirmadores("RF: No se pudo obtener respuesta del servidor");
        } else {
          setErrorFirmadores("RF: Error al enviar la solicitud");
        }
      }
    };
    mostrarFirmador();
  }, []);

  const crearFirmadorUsuario = async (firmadorId) => {
    const updateUrl = `${apiKey}/firmadorusuario`;
    const formData = {
      firmador: firmadorId,
      usuario: userId,
    };
    try {
      const response = await axios.post(updateUrl, formData, { headers });
      if (response.data) {
        setErrorFirmadoresUsuarios(null);
        setCrearFirmadoresUsuarios(response.data);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          setErrorUsetErrorFirmadoresUsuariospdate(`RS: ${data.message}`);
        } else if (status === 500) {
          setErrorFirmadoresUsuarios(`RS: ${data.message}`);
        }
      } else if (error.request) {
        setErrorFirmadoresUsuarios(
          "RF: No se pudo obtener respuesta del servidor"
        );
      } else {
        setErrorFirmadoresUsuarios("RF: Error al enviar la solicitud");
      }
    }
  };

  useEffect(() => {
    if (selectedCargo && firmadores) {
      const firmadorSeleccionado = firmadores.find(
        (firmador) => firmador.cargo === selectedCargo
      );
      if (!firmadorSeleccionado) {
        setSelectedCargo("");
      }
    }
  }, [firmadores]);

  return (
    <>
      {/* <FormControl fullWidth> */}
      {/* <Select
        // defaultValue={selectedCargo2}
        inputProps={{ "aria-label": "Without label" }}
        displayEmpty
        value={selectedCargo2 || ""}
        onChange={(e) => {
          setSelectedCargo(e.target.value);
          const selectedFirmadorId = e.target.value;
          crearFirmadorUsuario(selectedFirmadorId);
        }}
        required
      >
        <MenuItem value="">
            {selectedCargo2 ? <em>{selectedCargo2}</em> : <em>Seleccione</em>}
          </MenuItem>

        {firmadores &&
          firmadores.map((firmador) => (
            <>
              <MenuItem key={firmador.id} value={firmador.id}>
                b: {firmador.cargo},{firmador.id}
              </MenuItem>
            </>
          ))}
      </Select> */}
      {/* </FormControl> */}
      <br />
      <div style={{ width: "100%" }}>
        <select
          value={selectedCargo || ""}
          onChange={(e) => {
            setSelectedCargo(e.target.value);
            const selectedFirmadorId = e.target.value;
            crearFirmadorUsuario(selectedFirmadorId);
          }}
          required
        >
          <option value="" disabled hidden>
            {selectedCargo2 ? selectedCargo2 : "Seleccione"}
          </option>
          {firmadores &&
            firmadores.map((firmador) => (
              <option key={firmador.id} value={firmador.id}>
                {firmador.cargo}
              </option>
            ))}
        </select>
      </div>
    </>
  );
}
