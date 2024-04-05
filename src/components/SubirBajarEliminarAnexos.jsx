import React, { useState } from "react";
import axios from "axios";
import { obtenerToken } from "../utils/auth";
import { obtenerUserId } from "../utils/userdata";

import TextField from "@mui/material/TextField";

import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Input from "@mui/material/Input";

import { AnexosInstruc } from "./AnexosInstruc";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function SubirBajarEliminarAnexos({ iddesem, tiporesid, referencias }) {
  const apiKey = import.meta.env.VITE_BASE_URL_BACKEND;

  const [respuestasError, setErrorRespuestas] = useState(null);

  const [selecionarPDF, setSelecionarPDF] = useState(null);

  const [respuestaMessage, setRespuestaMessage] = useState(null);

  const [abrirGuardar, setAbrirGuardar] = useState(false);

  const userId = obtenerUserId();

  const cargarElPDF = (event) => {
    setSelecionarPDF(event.target.files[0]);
    respuestasError(null);
    respuestaMessage(null);
  };

  const guardarPdf = async () => {
    try {
      const token = obtenerToken();

      const formData = new FormData();
      formData.append("file", selecionarPDF);
      formData.append("id_user", userId);
      formData.append("tiporespaldo_id", tiporesid);
      formData.append("desembolsos_id", iddesem);
      formData.append("referencia", referencias);

      const response = await axios.post(
        `${apiKey}/respaldodesembolsos`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        const { message } = response.data;
        setErrorRespuestas(null);
        setRespuestaMessage(`RS: ${message}`);
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

  const abrirGuardarPdf = () => {
    setAbrirGuardar(true);
  };

  const cerrarGuardarPdf = () => {
    setAbrirGuardar(false);
    setErrorRespuestas(null);
    setRespuestaMessage(null);
  };

  return (
    <>
      <input size="small" type="file" accept=".pdf" onChange={cargarElPDF} />
      <Button
        disabled={!selecionarPDF}
        onClick={guardarPdf}
        variant="outlined"
        size="small"
      >
        Subir PDF
      </Button>
      {respuestasError && (
        <p className="text-center m-2 text-red-500">{respuestasError}</p>
      )}
      {respuestaMessage && (
        <p className="text-center m-2 text-green-500">{respuestaMessage}</p>
      )}
     
    </>
  );
}
